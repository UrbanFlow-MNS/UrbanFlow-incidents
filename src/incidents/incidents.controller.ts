import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  create(@Body() createIncidentDto: CreateIncidentDto) {
    return this.incidentsService.create(createIncidentDto);
  }

  @Get()
  findAll() {
    return this.incidentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIncidentDto: UpdateIncidentDto) {
    return this.incidentsService.update(+id, updateIncidentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incidentsService.remove(+id);
  }

  @MessagePattern({ cmd: 'incident.findAll' })
  findAllTcp() {
    return this.incidentsService.findAll();
  }

  @MessagePattern({ cmd: 'incident.findOne' })
  findOneTcp(@Payload() id: number) {
    return this.incidentsService.findOne(id);
  }

  @MessagePattern({ cmd: 'incident.create' })
  createTcp(@Payload() createIncidentDto: CreateIncidentDto) {
    return this.incidentsService.create(createIncidentDto);
  }

  @MessagePattern({ cmd: 'incident.update' })
  updateTcp(@Payload() data: { id: number; dto: UpdateIncidentDto; callerId?: number; callerRole?: string }) {
    return this.incidentsService.update(data.id, data.dto, data.callerId, data.callerRole);
  }

  @MessagePattern({ cmd: 'incident.remove' })
  removeTcp(@Payload() data: { id: number; callerId?: number; callerRole?: string }) {
    return this.incidentsService.remove(data.id, data.callerId, data.callerRole);
  }
}
