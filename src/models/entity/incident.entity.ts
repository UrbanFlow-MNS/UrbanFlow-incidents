import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Site } from './site.entity';
import { Category } from './category.entity';

@Entity()
export class Incident {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    estimateDuration: string;

    @Column()
    status: string;

    @Column()
    priority: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    creationDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    resolutionDate?: Date;

    @Column()
    siteId: number;

    @ManyToOne(() => Site)
    site: Site;

    @Column()
    categoryId: number;

    @ManyToOne(() => Category)
    category: Category;

    @Column()
    createdBy: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}