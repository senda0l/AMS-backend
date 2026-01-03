import { BaseEntity } from '../../common/entities/base.entity';
import { Issue } from './issue.entity';
import { User } from '../../users/entities/user.entity';
export declare class IssueComment extends BaseEntity {
    content: string;
    issueId: string;
    issue: Issue;
    userId: string;
    user: User;
}
