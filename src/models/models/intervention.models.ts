import { SiteModel } from './site.models';
import { IncidentModel } from './incident.models';
import { InterventionStatus } from '../enums/enums';

export class InterventionModel {
    id: number;
    userId: number | null;
    incident: IncidentModel;
    incidentId: number;
    site: SiteModel;
    siteId: number;
    status: InterventionStatus;
    startAt: Date;
    endAt?: Date;
    workNote?: string;
    travelTimes?: number;
    workTimes?: number;
    createdAt: Date;
    updatedAt: Date;
}