export interface SiteModel {
  id: number;
  name: string;
  address: string;
  city: string;
  zipcode: string;
  gpsLat: number;
  gpsLng: number;
  contactName?: string;
  contactPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}
