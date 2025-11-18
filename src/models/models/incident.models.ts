import { Site } from './site.models';
import { Category } from './category.models';

export class Incident {
    id: number;
    code: string;
    name: string;
    description: string;
    estimateDuration: number;
    status: string;
    priority: string;
    creationDate: Date;
    resolutionDate?: Date;
    siteId: number;
    site: Site;
    categoryId: number;
    category: Category;
    createdBy: number;
    updatedAt: Date;
}