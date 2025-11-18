import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Site } from './site.entity';
import { Incident } from './incident.entity';

@Entity()
export class Intervention { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId: number | null;

    @ManyToOne(() => Incident)
    @JoinColumn({ name: 'incidentId' })
    incident: Incident;

    @Column()
    incidentId: number;

    @ManyToOne(() => Site)
    @JoinColumn({ name: 'siteId' })
    site: Site;

    @Column()
    siteId: number;

    @Column({ type: 'timestamp' })
    startAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    endAt?: Date;

    @Column({ type: 'text', nullable: true })
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