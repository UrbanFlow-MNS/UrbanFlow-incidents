export class Site {
    id: number;
    name: string;
    address: string;
    city: string;
    zipcode: string;
    latitude: number;
    longitude: number;
    contactName?: string;
    contactPhone?: string;
    createdAt: Date;
    updatedAt: Date;
}