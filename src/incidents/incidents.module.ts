import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { IncidentEntity } from '../models/entity/incident.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([IncidentEntity]),
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
  controllers: [IncidentsController],
  providers: [IncidentsService],
})
export class IncidentsModule {}
