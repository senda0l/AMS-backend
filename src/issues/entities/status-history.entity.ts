import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Issue} from './issue.entity';
import { IssueStatus } from './issue-status.enum';
import { User } from '../../users/entities/user.entity';

@Entity('status_history')
export class StatusHistory extends BaseEntity {
  @Column({
    type: 'enum',
    enum: IssueStatus,
    enumName: 'issue_status_enum', // <--- добавили
  })
  status: IssueStatus;

  @Column({ type: 'uuid' })
  issueId: string;

  @ManyToOne(() => Issue, (issue) => issue.statusHistory)
  @JoinColumn({ name: 'issueId' })
  issue: Issue;

  @Column({ type: 'uuid', nullable: true })
  changedById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'changedById' })
  changedBy: User;

  @Column('text', { nullable: true })
  notes: string;
}

