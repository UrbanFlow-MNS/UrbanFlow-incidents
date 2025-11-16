export interface UserAccountModel {
  id: number;
  email: string;
  name: string;
  firstName: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
