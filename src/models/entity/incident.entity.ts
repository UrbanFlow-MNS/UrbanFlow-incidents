import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SiteEntity } from './site.entity';
import { CategoryEntity } from './category.entity';

@Entity()
export class IncidentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    estimateDuration: string;

    @Column()
    status: string;

    @Column()
    priority: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    creationDate: Date;

    @Column({ type: 'datetime', nullable: true })
    resolutionDate?: Date;

    @Column()
    siteId: number;

    @ManyToOne(() => SiteEntity)
    @JoinColumn({ name: 'siteId' })
    site: SiteEntity;

    @Column()
    categoryId: number;

    @ManyToOne(() => CategoryEntity)
    @JoinColumn({ name: 'categoryId' })
    category: CategoryEntity;

    @Column()
    createdBy: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}