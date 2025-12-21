import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { IncidentEntity } from '../models/entity/incident.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IncidentEntity])],
  controllers: [IncidentsController],
  providers: [IncidentsService],
})
export class IncidentsModule {}
