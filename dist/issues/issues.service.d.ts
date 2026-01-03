import { Repository } from 'typeorm';
import { IssueStatus } from './entities/issue-status.enum';
import { Issue } from './entities/issue.entity';
import { IssueComment } from './entities/issue-comment.entity';
import { StatusHistory } from './entities/status-history.entity';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueStatusDto } from './dto/update-issue-status.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '../users/entities/user.entity';
export declare class IssuesService {
    private issueRepository;
    private commentRepository;
    private statusHistoryRepository;
    private notificationsService;
    constructor(issueRepository: Repository<Issue>, commentRepository: Repository<IssueComment>, statusHistoryRepository: Repository<StatusHistory>, notificationsService: NotificationsService);
    create(createIssueDto: CreateIssueDto, userId: string): Promise<Issue>;
    findAll(filters?: {
        status?: IssueStatus;
        category?: string;
        apartmentId?: string;
        assignedManagerId?: string;
    }): Promise<Issue[]>;
    findOne(id: string): Promise<Issue>;
    updateStatus(id: string, updateStatusDto: UpdateIssueStatusDto, userId: string, user: User): Promise<Issue>;
    addComment(id: string, createCommentDto: CreateCommentDto, userId: string): Promise<Issue>;
    private createStatusHistory;
    private checkStatusUpdatePermission;
    private isCategoryMatch;
}
