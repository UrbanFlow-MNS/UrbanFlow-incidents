import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';
import { InterventionEntity } from '../models/entity/intervention.entity';
import { SiteEntity } from '../models/entity/site.entity';
import { IncidentEntity } from '../models/entity/incident.entity';

@Injectable()
export class InterventionsService {
  constructor(
    @InjectRepository(InterventionEntity)
    private readonly interventionRepository: Repository<InterventionEntity>,
    @InjectRepository(SiteEntity)
    private readonly siteRepository: Repository<SiteEntity>,
    @InjectRepository(IncidentEntity)
    private readonly incidentRepository: Repository<IncidentEntity>,
  ) {}

  async create(createInterventionDto: CreateInterventionDto) {
    const site = await this.siteRepository.findOne({ where: { id: createInterventionDto.siteId } });
    if (!site) {
      throw new RpcException({ statusCode: 404, message: `Site with id ${createInterventionDto.siteId} not found` });
    }

    const incident = await this.incidentRepository.findOne({ where: { id: createInterventionDto.incidentId } });
    if (!incident) {
      throw new RpcException({ statusCode: 404, message: `Incident with id ${createInterventionDto.incidentId} not found` });
    }

    const intervention = this.interventionRepository.create(createInterventionDto);
    return await this.interventionRepository.save(intervention);
  }

  async findAll() {
    return await this.interventionRepository.find({
      relations: ['incident', 'site'],
    });
  }

  async findOne(id: number) {
    return await this.interventionRepository.findOne({
      where: { id },
      relations: ['incident', 'site'],
    });
  }

  async update(id: number, updateInterventionDto: UpdateInterventionDto) {
    await this.interventionRepository.update(id, updateInterventionDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.interventionRepository.delete(id);
  }
}
