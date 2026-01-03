import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueStatusDto } from './dto/update-issue-status.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class IssuesController {
    private readonly issuesService;
    constructor(issuesService: IssuesService);
    create(createIssueDto: CreateIssueDto, req: any): Promise<import("./entities/issue.entity").Issue>;
    findAll(status?: string, category?: string, apartmentId?: string, assignedManagerId?: string): Promise<import("./entities/issue.entity").Issue[]>;
    findOne(id: string): Promise<import("./entities/issue.entity").Issue>;
    updateStatus(id: string, updateStatusDto: UpdateIssueStatusDto, req: any): Promise<import("./entities/issue.entity").Issue>;
    addComment(id: string, createCommentDto: CreateCommentDto, req: any): Promise<import("./entities/issue.entity").Issue>;
}
