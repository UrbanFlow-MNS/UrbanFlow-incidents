import { InterventionStatus } from './incidentsEnums';

export interface InterventionModel {
  id: number;
  assignmentId: number;
  siteId: number;
  startAt: Date;
  endAt?: Date;
  status: InterventionStatus;
  workNotes: string;
  travelTimes: number;
  workTimes: number;
  customerSignatureName?: string;
  customerSignatureImage?: string;
  createdAt: Date;
  updatedAt: Date;
}
