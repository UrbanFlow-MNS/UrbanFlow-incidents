import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterventionsService } from './interventions.service';
import { InterventionsController } from './interventions.controller';
import { InterventionEntity } from '../models/entity/intervention.entity';
import { SiteEntity } from '../models/entity/site.entity';
import { IncidentEntity } from '../models/entity/incident.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InterventionEntity, SiteEntity, IncidentEntity])],
  controllers: [InterventionsController],
  providers: [InterventionsService],
})
export class InterventionsModule {}
