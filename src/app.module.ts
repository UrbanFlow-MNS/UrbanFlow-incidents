import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentEntity } from './models/entity/incident.entity';
import { CategoryEntity } from './models/entity/category.entity';
import { SiteEntity } from './models/entity/site.entity';
import { InterventionEntity } from './models/entity/intervention.entity';
import { AttachmentEntity } from './models/entity/attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'test',
      entities: [
        IncidentEntity,
        CategoryEntity,
        SiteEntity,
        InterventionEntity,
        AttachmentEntity,
      ],
      synchronize: true, // Enable on dev, disable on prod
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
