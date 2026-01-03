import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
export declare enum NotificationType {
    ISSUE_CREATED = "issue_created",
    ISSUE_ASSIGNED = "issue_assigned",
    ISSUE_STATUS_CHANGED = "issue_status_changed",
    COMMENT_ADDED = "comment_added",
    ISSUE_APPROVED = "issue_approved",
    ISSUE_REJECTED = "issue_rejected"
}
export declare class Notification extends BaseEntity {
    type: NotificationType;
    title: string;
    message: string;
    userId: string;
    user: User;
    isRead: boolean;
    relatedIssueId: string;
    metadata: Record<string, any>;
}
