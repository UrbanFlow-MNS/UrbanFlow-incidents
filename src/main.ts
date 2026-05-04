import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: Number(process.env.TCP_PORT) || 6004,
    },
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: () => new BadRequestException('A required field is missing'),
  }));

  await app.startAllMicroservices();
  await app.listen(Number(process.env.API_PORT) || 3000);
}
void bootstrap();
