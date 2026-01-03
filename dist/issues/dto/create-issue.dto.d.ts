import { IssueCategory } from '../entities/issue.entity';
export declare class CreateIssueDto {
    category: IssueCategory;
    title: string;
    description: string;
    photos?: string[];
    apartmentId: string;
}
