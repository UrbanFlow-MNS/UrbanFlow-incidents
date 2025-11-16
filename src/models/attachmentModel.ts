import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Incident } from './incidentModel';
import { UserAccount } from './userAccountModel';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'incident_id', type: 'int' })
  incidentId: number;

  @ManyToOne(() => Incident, (incident) => incident.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'incident_id' })
  incident: Incident;

  @Column({ name: 'uploaded_by_id', type: 'int' })
  uploadedById: number;

  @ManyToOne(() => UserAccount, (userAccount) => userAccount.attachments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy: UserAccount;

  @Column({ name: 'content_url', type: 'varchar', length: 500 })
  contentUrl: string;

  @Column({ name: 'attachment_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  attachmentDate: Date;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ name: 'content_type', type: 'varchar', length: 100, nullable: true })
  contentType?: string;
}
