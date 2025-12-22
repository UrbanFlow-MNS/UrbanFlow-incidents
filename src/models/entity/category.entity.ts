import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IncidentEntity } from './incident.entity';

@Entity()
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    isActive: boolean;

    @OneToMany(() => IncidentEntity, (incident) => incident.category)
    incidents: IncidentEntity[];
}