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

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: "postgres",
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
    
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
