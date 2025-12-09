import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterventionsService } from './interventions.service';
import { InterventionsController } from './interventions.controller';
import { InterventionEntity } from '../models/entity/intervention.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InterventionEntity])],
  controllers: [InterventionsController],
  providers: [InterventionsService],
})
export class InterventionsModule {}
