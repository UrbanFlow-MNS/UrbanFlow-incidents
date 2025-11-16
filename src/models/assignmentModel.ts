export interface AssignmentModel {
  id: number;
  incidentId: number;
  technicianId: number;
  isPrimary: boolean;
  assignedAt: Date;
  acceptedAt?: Date;
  declinedAt?: Date;
  note?: string;
}
