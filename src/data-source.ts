import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Category } from './models/categoryModel';
import { UserAccount } from './models/userAccountModel';
import { Technician } from './models/technicianModel';
import { Site } from './models/siteModel';
import { Incident } from './models/incidentModel';
import { Assignment } from './models/assignmentModel';
import { Intervention } from './models/interventionModel';
import { Comment } from './models/commentModel';
import { Attachment } from './models/attachmentModel';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'urbanflow_incidents',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [
    Category,
    UserAccount,
    Technician,
    Site,
    Incident,
    Assignment,
    Intervention,
    Comment,
    Attachment,
  ],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
