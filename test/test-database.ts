import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const testDatabase: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.TEST_POSTGRES_HOST ?? 'localhost',
  port: Number(process.env.TEST_POSTGRES_PORT ?? 55432),
  username: process.env.TEST_POSTGRES_USER ?? 'test',
  password: process.env.TEST_POSTGRES_PASSWORD ?? 'test',
  database: process.env.TEST_POSTGRES_DB ?? 'test',
  synchronize: true,
  dropSchema: true,
  logging: false,
};
