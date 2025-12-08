import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { SiteEntity } from './site.entity';
import { IncidentEntity } from './incident.entity';

@Entity()
export class InterventionEntity { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId: number | null;

    @ManyToOne(() => IncidentEntity)
    @JoinColumn({ name: 'incidentId' }) 
    incident: IncidentEntity;

    @Column()  
    incidentId: number; 

    @ManyToOne(() => SiteEntity)
    @JoinColumn({ name: 'siteId' })
    site: SiteEntity;

    @Column({ nullable: true })
    siteId: number;

    @Column({ type: 'timestamp' })
    startAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    endAt?: Date;

    @Column({ nullable: true })
    workNote?: string;

    @Column({ type : 'int', nullable: true })
    travelTimes?: number;

    @Column ({ type : 'int', nullable: true })
    workTimes?: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}