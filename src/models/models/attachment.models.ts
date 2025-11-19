import { IncidentModel } from './incident.models';

export class AttachmentModel {

    id: number;
    incidentId: number;
    incident: IncidentModel;
    updatedBy: number;
    contentUrl: string;
    contentType?: string;
    createdAt: Date;
}
