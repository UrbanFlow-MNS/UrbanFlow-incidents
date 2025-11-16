import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserAccount } from './userAccountModel';
import { Assignment } from './assignmentModel';

@Entity('technicians')
export class Technician {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_account_id', type: 'int', unique: true })
  userAccountId: number;

  @OneToOne(() => UserAccount, (userAccount) => userAccount.technician)
  @JoinColumn({ name: 'user_account_id' })
  userAccount: UserAccount;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'json' })
  skills: string[];

  @Column({ name: 'is_on_duty', type: 'boolean', default: false })
  isOnDuty: boolean;

  @Column({ name: 'location_lat', type: 'decimal', precision: 10, scale: 7, nullable: true })
  locationLat?: number;

  @Column({ name: 'location_lng', type: 'decimal', precision: 10, scale: 7, nullable: true })
  locationLng?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Assignment, (assignment) => assignment.technician)
  assignments: Assignment[];
}
