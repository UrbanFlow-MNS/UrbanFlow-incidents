import { Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteEntity } from '../models/entity/site.entity';

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(SiteEntity)
    private readonly siteRepository: Repository<SiteEntity>,
  ) {}
  async create(createSiteDto: CreateSiteDto) {
    const site = this.siteRepository.create(createSiteDto);
    return await this.siteRepository.save(site);
  }

  async findAll() {
    return await this.siteRepository.find();
  }

  async findOne(id: number) {
    return await this.siteRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateSiteDto: UpdateSiteDto) {
    await this.siteRepository.update(id, updateSiteDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.siteRepository.delete(id);
  }
}
