import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class AttachmentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    incidentId: number;

    @Column()
    updatedBy: number;

    @Column()
    contentUrl: string;

    @Column({ nullable: true })
    contentType?: string;

    @CreateDateColumn()
    createdAt: Date;

}