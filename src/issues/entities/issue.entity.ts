import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { IssueStatus } from './issue-status.enum';
import { IssuePriority } from './issue-priority.enum';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Apartment } from '../../buildings/entities/apartment.entity';
import { IssueComment } from './issue-comment.entity';
import { StatusHistory } from './status-history.entity';

export enum IssueCategory {
  GAS = 'gas',
  WATER = 'water',
  CLEANING = 'cleaning',
  OTHER = 'other',
}



@Entity('issues')
@Index(['status', 'createdAt'])
@Index(['category', 'status'])
@Index(['apartmentId', 'status'])
@Index(['assignedManagerId', 'status'])
@Index(['priority', 'status'])
export class Issue extends BaseEntity {
  @Column({ type: 'enum', enum: IssueCategory })
  @Index()
  category: IssueCategory;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('text', { array: true, default: [] })
  photos: string[];

  @Column({ type: 'enum', enum: IssueStatus, default: IssueStatus.NEW })
  @Index()
  status: IssueStatus;

  @Column({ type: 'enum', enum: IssuePriority, default: IssuePriority.MEDIUM })
  @Index()
  priority: IssuePriority;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => User, (user) => user.createdIssues)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ type: 'uuid' })
  apartmentId: string;

  @ManyToOne(() => Apartment, (apartment) => apartment.issues)
  @JoinColumn({ name: 'apartmentId' })
  apartment: Apartment;

  @Column({ type: 'uuid', nullable: true })
  assignedManagerId: string;

  @ManyToOne(() => User, (user) => user.assignedIssues)
  @JoinColumn({ name: 'assignedManagerId' })
  assignedManager: User;

  @OneToMany(() => IssueComment, (comment) => comment.issue)
  comments: IssueComment[];

  @OneToMany(() => StatusHistory, (history) => history.issue)
  statusHistory: StatusHistory[];

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;
}


