import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InterventionsService } from './interventions.service';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';

@Controller('interventions')
export class InterventionsController {
  constructor(private readonly interventionsService: InterventionsService) {}

  @Post()
  create(@Body() createInterventionDto: CreateInterventionDto) {
    return this.interventionsService.create(createInterventionDto);
  }

  @Get()
  findAll() {
    return this.interventionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.interventionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateInterventionDto: UpdateInterventionDto) {
    return this.interventionsService.update(id, updateInterventionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.interventionsService.remove(id);
  }

  @MessagePattern({ cmd: 'intervention.findAll' })
  findAllTcp() {
    return this.interventionsService.findAll();
  }

  @MessagePattern({ cmd: 'intervention.findOne' })
  findOneTcp(@Payload() id: number) {
    return this.interventionsService.findOne(id);
  }

  @MessagePattern({ cmd: 'intervention.create' })
  createTcp(@Payload() createInterventionDto: CreateInterventionDto) {
    return this.interventionsService.create(createInterventionDto);
  }

  @MessagePattern({ cmd: 'intervention.update' })
  updateTcp(@Payload() data: { id: number; dto: UpdateInterventionDto }) {
    return this.interventionsService.update(data.id, data.dto);
  }

  @MessagePattern({ cmd: 'intervention.remove' })
  removeTcp(@Payload() id: number) {
    return this.interventionsService.remove(id);
  }
}

