import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Incident } from './incidentModel';
import { UserAccount } from './userAccountModel';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'incident_id', type: 'int' })
  incidentId: number;

  @ManyToOne(() => Incident, (incident) => incident.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'incident_id' })
  incident: Incident;

  @Column({ name: 'author_id', type: 'int' })
  authorId: number;

  @ManyToOne(() => UserAccount, (userAccount) => userAccount.comments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'author_id' })
  author: UserAccount;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'add_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addDate: Date;
}
