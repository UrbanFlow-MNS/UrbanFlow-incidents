import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IncidentStatus, IncidentPriority } from './incidentsEnums';
import { Site } from './siteModel';
import { Category } from './categoryModel';
import { UserAccount } from './userAccountModel';
import { Assignment } from './assignmentModel';
import { Comment } from './commentModel';
import { Attachment } from './attachmentModel';

@Entity('incidents')
export class Incident {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: IncidentStatus, default: IncidentStatus.OPEN })
  status: IncidentStatus;

  @Column({ type: 'enum', enum: IncidentPriority })
  priority: IncidentPriority;

  @CreateDateColumn({ name: 'creation_date' })
  creationDate: Date;

  @Column({ name: 'resolution_date', type: 'timestamp', nullable: true })
  resolutionDate?: Date;

  @Column({ name: 'site_id', type: 'int' })
  siteId: number;

  @ManyToOne(() => Site, (site) => site.incidents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @Column({ name: 'category_id', type: 'int' })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.incidents, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'created_by_id', type: 'int' })
  createdById: number;

  @ManyToOne(() => UserAccount, (userAccount) => userAccount.createdIncidents, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserAccount;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Assignment, (assignment) => assignment.incident)
  assignments: Assignment[];

  @OneToMany(() => Comment, (comment) => comment.incident)
  comments: Comment[];

  @OneToMany(() => Attachment, (attachment) => attachment.incident)
  attachments: Attachment[];
}
