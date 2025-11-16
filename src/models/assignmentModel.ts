import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Incident } from './incidentModel';
import { Technician } from './technicianModel';
import { Intervention } from './interventionModel';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'incident_id', type: 'int' })
  incidentId: number;

  @ManyToOne(() => Incident, (incident) => incident.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'incident_id' })
  incident: Incident;

  @Column({ name: 'technician_id', type: 'int' })
  technicianId: number;

  @ManyToOne(() => Technician, (technician) => technician.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'technician_id' })
  technician: Technician;

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary: boolean;

  @Column({ name: 'assigned_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt: Date;

  @Column({ name: 'accepted_at', type: 'timestamp', nullable: true })
  acceptedAt?: Date;

  @Column({ name: 'declined_at', type: 'timestamp', nullable: true })
  declinedAt?: Date;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @OneToMany(() => Intervention, (intervention) => intervention.assignment)
  interventions: Intervention[];
}
