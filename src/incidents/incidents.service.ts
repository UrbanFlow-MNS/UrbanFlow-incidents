import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { Repository } from 'typeorm';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IncidentEntity } from '../models/entity/incident.entity';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(IncidentEntity)
    private readonly incidentRepository: Repository<IncidentEntity>,
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
  ) {}

  async create(createIncidentDto: CreateIncidentDto) {
    const incident = this.incidentRepository.create(createIncidentDto);
    const saved = await this.incidentRepository.save(incident);

    // Publier un message vers le service notifications via RabbitMQ
    this.notificationsClient.emit('notifications.sendEmail', {
      email: process.env.NOTIFICATION_DEFAULT_EMAIL ?? 'admin@urbanflow.fr',
      object: `[Incident] ${saved.name} - Priorité : ${saved.priority}`,
      body: `Un nouvel incident a été créé.\n\nCode : ${saved.code}\nNom : ${saved.name}\nDescription : ${saved.description}\nStatut : ${saved.status}\nPriorité : ${saved.priority}`,
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
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.incidentRepository.delete(id);
  }
}