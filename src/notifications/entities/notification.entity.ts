import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  ISSUE_CREATED = 'issue_created',
  ISSUE_ASSIGNED = 'issue_assigned',
  ISSUE_STATUS_CHANGED = 'issue_status_changed',
  COMMENT_ADDED = 'comment_added',
  ISSUE_APPROVED = 'issue_approved',
  ISSUE_REJECTED = 'issue_rejected',
}

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'uuid', nullable: true })
  relatedIssueId: string;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;
}


