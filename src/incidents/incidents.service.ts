import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { Repository } from 'typeorm';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IncidentEntity } from '../models/entity/incident.entity';
import { IncidentStatus } from '../models/enums/enums';
import { SiteEntity } from '../models/entity/site.entity';
import { CategoryEntity } from '../models/entity/category.entity';

@Injectable()
export class IncidentsService {
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
  ) {}

  async create(createIncidentDto: CreateIncidentDto) {
    const site = await this.siteRepository.findOne({ where: { id: createIncidentDto.siteId } });
    if (!site) {
      throw new NotFoundException(`Site with id ${createIncidentDto.siteId} not found`);
    }

    const category = await this.categoryRepository.findOne({ where: { id: createIncidentDto.categoryId } });
    if (!category) {
      throw new NotFoundException(`Category with id ${createIncidentDto.categoryId} not found`);
    }

    const incident = this.incidentRepository.create(createIncidentDto);
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

  async update(id: number, updateIncidentDto: UpdateIncidentDto) {
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

  async remove(id: number) {
    this.tripsClient.emit('incident.closed', { incidentId: id });
    await this.incidentRepository.delete(id);
  }
}