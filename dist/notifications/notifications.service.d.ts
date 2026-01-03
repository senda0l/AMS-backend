import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Issue } from '../issues/entities/issue.entity';
import { IssueStatus } from 'src/issues/entities/issue-status.enum';
import { User } from '../users/entities/user.entity';
export declare class NotificationsService {
    private notificationRepository;
    private userRepository;
    constructor(notificationRepository: Repository<Notification>, userRepository: Repository<User>);
    createIssueNotification(issue: Issue): Promise<void>;
    createStatusChangeNotification(issue: Issue, oldStatus: IssueStatus, newStatus: IssueStatus): Promise<void>;
    createAssignmentNotification(issue: Issue): Promise<void>;
    createCommentNotification(issue: Issue, commentUserId: string): Promise<void>;
    createApprovalNotification(issue: Issue, approved: boolean): Promise<void>;
    findAll(userId: string): Promise<Notification[]>;
    markAsRead(id: string, userId: string): Promise<Notification>;
    markAllAsRead(userId: string): Promise<void>;
    private createNotification;
}
