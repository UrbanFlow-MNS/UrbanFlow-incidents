import { Incident } from './incident.models';

export class Attachment {

    id: number;
    incidentId: number;
    incident: Incident;
    updatedBy: number;
    contentUrl: string;
    contentType?: string;
    createdAt: Date;
}
