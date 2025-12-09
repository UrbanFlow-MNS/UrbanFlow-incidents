import { SiteModel } from './site.models';
import { CategoryModel } from './category.models';
import { IncidentPriority, IncidentStatus } from '../enums/enums';

export class IncidentModel {
    id: number;
    code: string;
    name: string;
    description: string;
    estimateDuration: number;
    status: IncidentStatus;
    priority: IncidentPriority;
    createdAt: Date;
    resolutionDate?: Date;
    siteId: number;
    site: SiteModel;
    categoryId: number;
    category: CategoryModel;
    createdBy: number;
    updatedAt: Date;
}