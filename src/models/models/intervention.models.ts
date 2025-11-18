import { Site } from './site.models';
import { Incident } from './incident.models';

export class Intervention {
    id: number;
    userId: number | null;
    incident: Incident;
    incidentId: number;
    site: Site;
    siteId: number;
    startAt: Date;
    endAt?: Date;
    workNote?: string;
    travelTimes?: number;
    workTimes?: number;
    createdAt: Date;
    updatedAt: Date;
}