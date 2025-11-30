import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentEntity } from './models/entity/incident.entity';
import { CategoryEntity } from './models/entity/category.entity';
import { SiteEntity } from './models/entity/site.entity';
import { InterventionEntity } from './models/entity/intervention.entity';
import { AttachmentEntity } from './models/entity/attachment.entity';
import { IncidentsModule } from './incidents/incidents.module';
import { SitesModule } from './sites/sites.module';
import { InterventionsModule } from './interventions/interventions.module';
import { CategoriesModule } from './categories/categories.module';
import { AttachmentsModule } from './attachments/attachments.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        IncidentEntity,
        CategoryEntity,
        SiteEntity,
        InterventionEntity,
        AttachmentEntity,
      ],
      synchronize: true, // Enable on dev, disable on prod
    }),

    TypeOrmModule.forFeature([
      IncidentEntity,
      CategoryEntity,
      SiteEntity,
      InterventionEntity,
      AttachmentEntity,
    ]),

    IncidentsModule,

    SitesModule,

    InterventionsModule,

    CategoriesModule,

    AttachmentsModule,
    
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
