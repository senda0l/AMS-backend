import { BaseEntity } from '../../common/entities/base.entity';
import { Issue } from './issue.entity';
import { IssueStatus } from './issue-status.enum';
import { User } from '../../users/entities/user.entity';
export declare class StatusHistory extends BaseEntity {
    status: IssueStatus;
    issueId: string;
    issue: Issue;
    changedById: string;
    changedBy: User;
    notes: string;
}
