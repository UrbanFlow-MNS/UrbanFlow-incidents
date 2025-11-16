export interface TechnicianModel {
  id: number;
  userAccountId: number;
  phone: string;
  skills: string[];
  isOnDuty: boolean;
  locationLat?: number;
  locationLng?: number;
  createdAt: Date;
  updatedAt: Date;
}
