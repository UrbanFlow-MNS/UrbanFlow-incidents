import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { InterventionStatus } from './incidentsEnums';
import { Assignment } from './assignmentModel';
import { Site } from './siteModel';

@Entity('interventions')
export class Intervention {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'assignment_id', type: 'int' })
  assignmentId: number;

  @ManyToOne(() => Assignment, (assignment) => assignment.interventions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignment_id' })
  assignment: Assignment;

  @Column({ name: 'site_id', type: 'int' })
  siteId: number;

  @ManyToOne(() => Site, (site) => site.interventions, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @Column({ name: 'start_at', type: 'timestamp' })
  startAt: Date;

  @Column({ name: 'end_at', type: 'timestamp', nullable: true })
  endAt?: Date;

  @Column({ type: 'enum', enum: InterventionStatus, default: InterventionStatus.PLANNED })
  status: InterventionStatus;

  @Column({ name: 'work_notes', type: 'text' })
  workNotes: string;

  @Column({ name: 'travel_times', type: 'int', default: 0 })
  travelTimes: number;

  @Column({ name: 'work_times', type: 'int', default: 0 })
  workTimes: number;

  @Column({ name: 'customer_signature_name', type: 'varchar', length: 255, nullable: true })
  customerSignatureName?: string;

  @Column({ name: 'customer_signature_image', type: 'text', nullable: true })
  customerSignatureImage?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
