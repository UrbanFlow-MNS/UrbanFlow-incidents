import { Mock, vi } from 'vitest';
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
import request from 'supertest';
import { App } from 'supertest/types';
import { firstValueFrom, of } from 'rxjs';
import { IncidentsModule } from '../src/incidents/incidents.module';
import { SitesModule } from '../src/sites/sites.module';
import { CategoriesModule } from '../src/categories/categories.module';
import { InterventionsModule } from '../src/interventions/interventions.module';
import { AttachmentsModule } from '../src/attachments/attachments.module';
import { IncidentEntity } from '../src/models/entity/incident.entity';
import { SiteEntity } from '../src/models/entity/site.entity';
import { CategoryEntity } from '../src/models/entity/category.entity';
import { InterventionEntity } from '../src/models/entity/intervention.entity';
import { AttachmentEntity } from '../src/models/entity/attachment.entity';
import { GlobalRpcExceptionFilter } from '../src/filters/rpc-exception.filter';
import { testDatabase } from './test-database';

const TCP_PORT = 6099;

const TOULON = 7;
const HYERES = 8;
const SANS_AGENCE = 4;
const SUPERADMIN = 6;
const VOYAGEUR = 9;

const users: Record<number, { agencyId?: number; role: string }> = {
  [TOULON]: { agencyId: 1, role: 'USER_CITY' },
  [HYERES]: { agencyId: 2, role: 'USER_CITY' },
  [SANS_AGENCE]: { role: 'TECHNICIAN' },
  [SUPERADMIN]: { role: 'SUPERADMIN' },
  [VOYAGEUR]: { role: 'CLASSIC_USER' },
};

describe('Incidents (e2e)', () => {
  let app: INestApplication<App>;
  let client: ClientProxy;
  let findOneById: Mock;
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
    findOneById = vi.fn((req: { id: number }) =>
      of({ user: { id: req.id, ...users[req.id] } }),
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
        AttachmentsModule,
      ],
    })
      .overrideProvider('NOTIFICATIONS_SERVICE')
      .useValue({ emit: vi.fn() })
      .overrideProvider('TRIPS_SERVICE')
      .useValue({ emit: vi.fn() })
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

    const site = await send<{ id: number }>('site.create', {
      name: 'Depot Nord',
      address: '12 rue des Ateliers',
      city: 'Metz',
      zipcode: '57000',
      latitude: 49.1193,
      longitude: 6.1757,
    });
    siteId = site.id;

    const category = await send<{ id: number }>('category.create', {
      name: 'Accident',
      isActive: true,
    });
    categoryId = category.id;
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

  describe('cloisonnement par agence', () => {
    let incidentToulon: number;

    beforeEach(async () => {
      const created = await createIncident({ callerId: TOULON });
      incidentToulon = created.id;
    });

    it('rattache l incident à l agence de son auteur', async () => {
      expect(findOneById).toHaveBeenCalledWith(
        { id: TOULON },
        expect.anything(),
      );

      const found = await send<IncidentEntity>(
        'incident.findOne',
        incidentToulon,
      );
      expect(found.agencyId).toBe(1);
    });

    it('ignore une agence imposée par le client', async () => {
      const created = await createIncident({ callerId: TOULON, agencyId: 2 });

      expect(created.agencyId).toBe(1);
    });

    it('empêche une autre agence de modifier l incident', async () => {
      await expect(
        send('incident.update', {
          id: incidentToulon,
          dto: { title: 'tentative' },
          callerId: HYERES,
        }),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('empêche une autre agence de supprimer l incident', async () => {
      await expect(
        send('incident.remove', { id: incidentToulon, callerId: HYERES }),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('laisse l agence propriétaire modifier l incident', async () => {
      const updated = await send<IncidentEntity>('incident.update', {
        id: incidentToulon,
        dto: { title: 'correction locale' },
        callerId: TOULON,
      });

      expect(updated.title).toBe('correction locale');
    });

    it('laisse un superadmin agir sur toutes les agences', async () => {
      const updated = await send<IncidentEntity>('incident.update', {
        id: incidentToulon,
        dto: { title: 'correction globale' },
        callerId: SUPERADMIN,
        callerRole: 'SUPERADMIN',
      });

      expect(updated.title).toBe('correction globale');
    });

    it('laisse un utilisateur sans agence modifier son propre incident', async () => {
      const created = await createIncident({ callerId: SANS_AGENCE });

      const updated = await send<IncidentEntity>('incident.update', {
        id: created.id,
        dto: { title: 'sans agence' },
        callerId: SANS_AGENCE,
      });

      expect(updated.title).toBe('sans agence');
    });
  });

  describe('droits par rôle', () => {
    it('laisse un superadmin créer un incident', async () => {
      const created = await createIncident({ callerId: SUPERADMIN });

      expect(created.id).toBeDefined();
    });

    it('refuse la création d un incident par un voyageur', async () => {
      await expect(
        createIncident({ callerId: VOYAGEUR }),
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it('refuse la modification d un incident sans agence par un voyageur', async () => {
      const created = await createIncident({ callerId: SANS_AGENCE });

      await expect(
        send('incident.update', {
          id: created.id,
          dto: { title: 'tentative' },
          callerId: VOYAGEUR,
        }),
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it('refuse la suppression d un incident sans agence par un voyageur', async () => {
      const created = await createIncident({ callerId: SANS_AGENCE });

      await expect(
        send('incident.remove', { id: created.id, callerId: VOYAGEUR }),
      ).rejects.toMatchObject({ statusCode: 403 });
    });
  });

  describe('interventions liées', () => {
    it('supprime les interventions rattachées à un incident supprimé', async () => {
      const incident = await createIncident({ callerId: TOULON });

      const intervention = await send<{ id: number }>('intervention.create', {
        incidentId: incident.id,
        siteId,
        startAt: new Date().toISOString(),
        workNote: 'remplacement du feu',
      });

      await send('incident.remove', { id: incident.id, callerId: TOULON });

      await expect(
        send('intervention.findOne', intervention.id),
      ).resolves.toBeFalsy();
    });

    it('refuse une intervention sur un incident inconnu', async () => {
      await expect(
        send('intervention.create', {
          incidentId: 999999,
          siteId,
          startAt: new Date().toISOString(),
        }),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('accès direct en http', () => {
    it('refuse la création d un incident sans passer par la gateway', async () => {
      await request(app.getHttpServer())
        .post('/incidents')
        .send(payload())
        .expect(403);
    });

    it('refuse la suppression d un incident', async () => {
      const incident = await createIncident({ callerId: TOULON });

      await request(app.getHttpServer())
        .delete(`/incidents/${incident.id}`)
        .expect(403);

      const found = await send<IncidentEntity>('incident.findOne', incident.id);
      expect(found.id).toBe(incident.id);
    });

    it('refuse la lecture et l ajout de pièces jointes', async () => {
      await request(app.getHttpServer()).get('/attachments').expect(403);
      await request(app.getHttpServer())
        .post('/attachments')
        .send({ incidentId: 1, updatedBy: 1, contentUrl: 'http://exemple.fr' })
        .expect(403);
    });

    it('refuse aussi les sites, les catégories et les interventions', async () => {
      await request(app.getHttpServer()).get('/sites').expect(403);
      await request(app.getHttpServer()).get('/categories').expect(403);
      await request(app.getHttpServer()).get('/interventions').expect(403);
    });
  });
});
