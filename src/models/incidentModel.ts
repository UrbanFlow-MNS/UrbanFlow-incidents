import { IncidentStatus, IncidentPriority } from './incidentsEnums';

export interface IncidentModel {
  id: number;
  code: string;
  name: string;
  description: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  creationDate: Date;
  resolutionDate?: Date;
  siteId: number;
  categoryId: number;
  createdById: number;
  updatedAt: Date;
}
