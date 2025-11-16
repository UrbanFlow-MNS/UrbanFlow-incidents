import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Incident } from './incidentModel';
import { Intervention } from './interventionModel';

@Entity('sites')
export class Site {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 20 })
  zipcode: string;

  @Column({ name: 'gps_lat', type: 'decimal', precision: 10, scale: 7 })
  gpsLat: number;

  @Column({ name: 'gps_lng', type: 'decimal', precision: 10, scale: 7 })
  gpsLng: number;

  @Column({ name: 'contact_name', type: 'varchar', length: 255, nullable: true })
  contactName?: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 20, nullable: true })
  contactPhone?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Incident, (incident) => incident.site)
  incidents: Incident[];

  @OneToMany(() => Intervention, (intervention) => intervention.site)
  interventions: Intervention[];
}
