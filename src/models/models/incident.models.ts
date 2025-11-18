import { Site } from './site.models';
import { Category } from './category.models';
import { IncidentPriority, IncidentStatus } from '../enums/enums';

export class Incident {
    id: number;
    code: string;
    name: string;
    description: string;
    estimateDuration: number;
    status: IncidentStatus;
    priority: IncidentPriority;
    creationDate: Date;
    resolutionDate?: Date;
    siteId: number;
    site: Site;
    categoryId: number;
    category: Category;
    createdBy: number;
    updatedAt: Date;
}