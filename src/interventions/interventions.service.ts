import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';
import { InterventionEntity } from '../models/entity/intervention.entity';

@Injectable()
export class InterventionsService {
  constructor(
    @InjectRepository(InterventionEntity)
    private readonly interventionRepository: Repository<InterventionEntity>,
  ) {}

  async create(createInterventionDto: CreateInterventionDto) { 
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
