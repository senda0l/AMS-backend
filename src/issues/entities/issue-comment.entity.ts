import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Issue } from './issue.entity';
import { User } from '../../users/entities/user.entity';

@Entity('issue_comments')
export class IssueComment extends BaseEntity {
  @Column('text')
  content: string;

  @Column({ type: 'uuid' })
  issueId: string;

  @ManyToOne(() => Issue, (issue) => issue.comments)
  @JoinColumn({ name: 'issueId' })
  issue: Issue;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}


