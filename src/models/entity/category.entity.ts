import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    isActive: boolean;
}