import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { firstValueFrom, Observable } from 'rxjs';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { Repository } from 'typeorm';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IncidentEntity } from '../models/entity/incident.entity';
import { IncidentStatus } from '../models/enums/enums';
import { SiteEntity } from '../models/entity/site.entity';
import { CategoryEntity } from '../models/entity/category.entity';
import { UserDtoGrpc, UserServiceClient, USER_SERVICE_NAME } from '../../../proto/generated/typescript/user';

@Injectable()
export class IncidentsService implements OnModuleInit {
  private userService!: UserServiceClient;

  constructor(
    @InjectRepository(IncidentEntity)
    private readonly incidentRepository: Repository<IncidentEntity>,
    @InjectRepository(SiteEntity)
    private readonly siteRepository: Repository<SiteEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
    @Inject('TRIPS_SERVICE')
    private readonly tripsClient: ClientProxy,
    @Inject('USER_PACKAGE')
    private readonly userClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService = this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  private async getCallerAgencyId(callerId?: number): Promise<number | undefined> {
    if (!callerId) return undefined;

    const meta = new Metadata();
    meta.add('x-internal-secret', process.env.USER_INTERNAL_SECRET ?? '');

    const fn = this.userService['findOneById'] as unknown as (
      req: unknown,
      metadata: Metadata,
    ) => Observable<{ user?: UserDtoGrpc }>;

    const res: { user?: UserDtoGrpc } = await firstValueFrom(
      fn.call(this.userService, { id: callerId }, meta),
    );
    return res?.user?.agencyId;
  }

  async create(createIncidentDto: CreateIncidentDto) {
    const site = await this.siteRepository.findOne({ where: { id: createIncidentDto.siteId } });
    if (!site) {
      throw new NotFoundException(`Site with id ${createIncidentDto.siteId} not found`);
    }

    const category = await this.categoryRepository.findOne({ where: { id: createIncidentDto.categoryId } });
    if (!category) {
      throw new NotFoundException(`Category with id ${createIncidentDto.categoryId} not found`);
    }

    const agencyId = await this.getCallerAgencyId(createIncidentDto.callerId);

    const incident = this.incidentRepository.create({ ...createIncidentDto, agencyId });
    const saved = await this.incidentRepository.save(incident);

    this.tripsClient.emit('incident.created', {
      incidentId: saved.id,
      siteId: saved.siteId,
      estimateDuration: saved.estimateDuration,
      priority: saved.priority,
      status: saved.status,
      affectedStopIds: createIncidentDto.affectedStopIds ?? [],
      affectedRouteIds: createIncidentDto.affectedRouteIds ?? [],
    });

    this.notificationsClient.emit('notifications.sendEmail', {
      email: process.env.NOTIFICATION_DEFAULT_EMAIL ?? 'urban.flow.moselle@gmail.com',
      object: `[Incident] ${saved.title} - Priorité : ${saved.priority}`,
      body: `Un nouvel incident a été créé.

      Code : ${saved.code}
      Nom : ${saved.name}
      Titre : ${saved.title}
      Description : ${saved.description}
      Statut : ${saved.status}
      Priorité : ${saved.priority}`,
      
    });

    return saved;
  }

  async findAll() {
    return await this.incidentRepository.find({
      relations: ['category', 'site'],
    });
  }

  async findOne(id: number) {
    return await this.incidentRepository.findOne({
      where: { id },
      relations: ['category', 'site'],
    });
  }

  private async assertSameAgency(id: number, callerId?: number, callerRole?: string) {
    if (callerRole === 'SUPERADMIN') return;

    const incident = await this.incidentRepository.findOne({ where: { id } });
    if (!incident) {
      throw new NotFoundException(`Incident with id ${id} not found`);
    }

    const callerAgencyId = await this.getCallerAgencyId(callerId);
    if ((incident.agencyId ?? null) !== (callerAgencyId ?? null)) {
      throw new NotFoundException(`Incident with id ${id} not found`);
    }
  }

  async update(id: number, updateIncidentDto: UpdateIncidentDto, callerId?: number, callerRole?: string) {
    await this.assertSameAgency(id, callerId, callerRole);
    await this.incidentRepository.update(id, updateIncidentDto);
    const updated = await this.findOne(id);

    if (
      (updateIncidentDto.status as IncidentStatus) === IncidentStatus.RESOLVED ||
      (updateIncidentDto.status as IncidentStatus) === IncidentStatus.CLOSED
    ) {
      this.tripsClient.emit('incident.closed', { incidentId: id });
    }

    return updated;
  }

  async remove(id: number, callerId?: number, callerRole?: string) {
    await this.assertSameAgency(id, callerId, callerRole);
    this.tripsClient.emit('incident.closed', { incidentId: id });
    return await this.incidentRepository.delete(id);
  }
}