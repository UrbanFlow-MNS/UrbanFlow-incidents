import { Injectable } from '@nestjs/common';
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
  ) {}

  async create(createIncidentDto: CreateIncidentDto) {
    const incident = this.incidentRepository.create(createIncidentDto);
    return await this.incidentRepository.save(incident);
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
