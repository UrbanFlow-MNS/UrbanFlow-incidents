import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { firstValueFrom, of } from 'rxjs';
import { IncidentsModule } from '../src/incidents/incidents.module';
import { SitesModule } from '../src/sites/sites.module';
import { CategoriesModule } from '../src/categories/categories.module';
import { InterventionsModule } from '../src/interventions/interventions.module';
import { IncidentEntity } from '../src/models/entity/incident.entity';
import { SiteEntity } from '../src/models/entity/site.entity';
import { CategoryEntity } from '../src/models/entity/category.entity';
import { InterventionEntity } from '../src/models/entity/intervention.entity';
import { AttachmentEntity } from '../src/models/entity/attachment.entity';
import { GlobalRpcExceptionFilter } from '../src/filters/rpc-exception.filter';
import { testDatabase } from './test-database';

const TCP_PORT = 6099;

const TOULON = 7;

const agencies: Record<number, number | undefined> = {
  [TOULON]: 1,
};

describe('Incidents (e2e)', () => {
  let app: INestApplication;
  let client: ClientProxy;
  let findOneById: jest.Mock;
  let siteId: number;
  let categoryId: number;

  const payload = (extra: Record<string, unknown> = {}) => ({
    code: 'INC-001',
    name: 'panne',
    title: 'Panne de signalisation',
    description: 'feu hors service',
    estimateDuration: 30,
    createdBy: TOULON,
    siteId,
    categoryId,
    status: 'OPEN',
    priority: 'LOW',
    ...extra,
  });

  const send = <T>(cmd: string, data: unknown) =>
    firstValueFrom(client.send<T>({ cmd }, data));

  const createIncident = (extra: Record<string, unknown> = {}) =>
    send<IncidentEntity>('incident.create', payload(extra));

  beforeAll(async () => {
    findOneById = jest.fn((req: { id: number }) =>
      of({ user: { id: req.id, agencyId: agencies[req.id] } }),
    );

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...testDatabase,
          entities: [
            IncidentEntity,
            SiteEntity,
            CategoryEntity,
            InterventionEntity,
            AttachmentEntity,
          ],
        }),
        IncidentsModule,
        SitesModule,
        CategoriesModule,
        InterventionsModule,
      ],
    })
      .overrideProvider('NOTIFICATIONS_SERVICE')
      .useValue({ emit: jest.fn() })
      .overrideProvider('TRIPS_SERVICE')
      .useValue({ emit: jest.fn() })
      .overrideProvider('USER_PACKAGE')
      .useValue({ getService: () => ({ findOneById }) })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new GlobalRpcExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        exceptionFactory: () =>
          new BadRequestException('A required field is missing'),
      }),
    );
    app.connectMicroservice<MicroserviceOptions>(
      {
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: TCP_PORT },
      },
      { inheritAppConfig: true },
    );

    await app.startAllMicroservices();
    await app.init();

    client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: TCP_PORT },
    });
    await client.connect();

    const site = await request(app.getHttpServer())
      .post('/sites')
      .send({
        name: 'Depot Nord',
        address: '12 rue des Ateliers',
        city: 'Metz',
        zipcode: '57000',
        latitude: 49.1193,
        longitude: 6.1757,
      })
      .expect(201);
    siteId = (site.body as { id: number }).id;

    const category = await request(app.getHttpServer())
      .post('/categories')
      .send({ name: 'Accident', isActive: true })
      .expect(201);
    categoryId = (category.body as { id: number }).id;
  });

  afterAll(async () => {
    await client?.close();
    await app?.close();
  });

  describe('cycle de vie complet', () => {
    let incidentId: number;

    it('crée un incident rattaché au site et à la catégorie', async () => {
      const created = await createIncident({ callerId: TOULON });

      expect(created.id).toBeDefined();
      expect(created.siteId).toBe(siteId);
      expect(created.categoryId).toBe(categoryId);
      incidentId = created.id;
    });

    it('retourne l incident avec ses relations', async () => {
      const found = await send<IncidentEntity>('incident.findOne', incidentId);

      expect(found.site.name).toBe('Depot Nord');
      expect(found.category.name).toBe('Accident');
    });

    it('liste les incidents', async () => {
      const all = await send<IncidentEntity[]>('incident.findAll', {});

      expect(all.some((i) => i.id === incidentId)).toBe(true);
    });

    it('met à jour un incident', async () => {
      const updated = await send<IncidentEntity>('incident.update', {
        id: incidentId,
        dto: { title: 'Panne corrigée', status: 'RESOLVED' },
        callerId: TOULON,
      });

      expect(updated.title).toBe('Panne corrigée');
      expect(updated.status).toBe('RESOLVED');
    });

    it('supprime un incident', async () => {
      const removed = await send<{ affected: number }>('incident.remove', {
        id: incidentId,
        callerId: TOULON,
      });

      expect(removed.affected).toBe(1);
      await expect(send('incident.findOne', incidentId)).resolves.toBeFalsy();
    });
  });

  describe('validation des entrées', () => {
    it('refuse un incident sans champ obligatoire', async () => {
      const incomplet = payload();
      delete (incomplet as Partial<typeof incomplet>).code;

      await expect(send('incident.create', incomplet)).rejects.toMatchObject({
        statusCode: 400,
      });
    });

    it('refuse un statut hors de la liste autorisée', async () => {
      await expect(
        send('incident.create', payload({ status: 'INEXISTANT' })),
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('refuse un site inconnu', async () => {
      await expect(
        send('incident.create', payload({ siteId: 999999 })),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('refuse une catégorie inconnue', async () => {
      await expect(
        send('incident.create', payload({ categoryId: 999999 })),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('ignore les champs non déclarés dans le dto', async () => {
      const created = await createIncident({ champInconnu: 'valeur' });

      expect(
        (created as unknown as Record<string, unknown>).champInconnu,
      ).toBeUndefined();
    });
  });
});
