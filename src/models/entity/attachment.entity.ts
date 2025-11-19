import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;


}