import { Module } from '@nestjs/common';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteEntity } from '../models/entity/site.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SiteEntity])],
  controllers: [SitesController],
  providers: [SitesService],
})
export class SitesModule {}
