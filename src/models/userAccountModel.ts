import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Technician } from './technicianModel';
import { Incident } from './incidentModel';
import { Comment } from './commentModel';
import { Attachment } from './attachmentModel';

@Entity('user_accounts')
export class UserAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  role: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Technician, (technician) => technician.userAccount)
  technician?: Technician;

  @OneToMany(() => Incident, (incident) => incident.createdBy)
  createdIncidents: Incident[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Attachment, (attachment) => attachment.uploadedBy)
  attachments: Attachment[];
}
