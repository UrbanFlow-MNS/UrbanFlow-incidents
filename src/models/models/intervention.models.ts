import { Site } from './site.models';
import { Incident } from './incident.models';
import { InterventionStatus } from '../enums/enums';

export class Intervention {
    id: number;
    userId: number | null;
    incident: Incident;
    incidentId: number;
    site: Site;
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