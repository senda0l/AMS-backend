import { IssueStatus } from '../entities/issue-status.enum';
export declare class UpdateIssueStatusDto {
    status: IssueStatus;
    notes?: string;
    assignedManagerId?: string;
}
