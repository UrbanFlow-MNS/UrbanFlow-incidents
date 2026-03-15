import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
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

    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        IncidentEntity,
        CategoryEntity,
        SiteEntity,
        InterventionEntity,
        AttachmentEntity,
      ],
      synchronize: Boolean(process.env.POSTGRES_SYNCHRONISE), // Enable on dev, disable on prod
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

    ClientsModule.register([
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ ?? 'amqp://localhost:5672'],
          queue: 'NOTIFICATIONS_QUEUE',
          queueOptions: { durable: false },
        },
      },
    ]),
    
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
