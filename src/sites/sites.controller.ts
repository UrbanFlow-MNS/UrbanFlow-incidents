import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  create(@Body() createSiteDto: CreateSiteDto) {
    return this.sitesService.create(createSiteDto);
  }

  @Get()
  findAll() {
    return this.sitesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.sitesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSiteDto: UpdateSiteDto) {
    return this.sitesService.update(id, updateSiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.sitesService.remove(id);
  }

  @MessagePattern({ cmd: 'site.findAll' })
  findAllTcp() {
    return this.sitesService.findAll();
  }

  @MessagePattern({ cmd: 'site.findOne' })
  findOneTcp(@Payload() id: number) {
    return this.sitesService.findOne(id);
  }

  @MessagePattern({ cmd: 'site.create' })
  createTcp(@Payload() createSiteDto: CreateSiteDto) {
    console.log("Received create site command with data (incidents service):", createSiteDto);
    return this.sitesService.create(createSiteDto);
  }

  @MessagePattern({ cmd: 'site.update' })
  updateTcp(@Payload() data: { id: number; dto: UpdateSiteDto }) {
    return this.sitesService.update(data.id, data.dto);
  }

  @MessagePattern({ cmd: 'site.remove' })
  removeTcp(@Payload() id: number) {
    return this.sitesService.remove(id);
  }
}

