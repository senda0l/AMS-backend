import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { IssueStatus } from './issue-status.enum';
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
export class Issue extends BaseEntity {
  @Column({ type: 'enum', enum: IssueCategory })
  category: IssueCategory;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('text', { array: true, default: [] })
  photos: string[];

  @Column({ type: 'enum', enum: IssueStatus, default: IssueStatus.NEW })
  status: IssueStatus;

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


