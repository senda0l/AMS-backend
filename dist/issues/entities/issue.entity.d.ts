import { IssueStatus } from './issue-status.enum';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Apartment } from '../../buildings/entities/apartment.entity';
import { IssueComment } from './issue-comment.entity';
import { StatusHistory } from './status-history.entity';
export declare enum IssueCategory {
    GAS = "gas",
    WATER = "water",
    CLEANING = "cleaning",
    OTHER = "other"
}
export declare class Issue extends BaseEntity {
    category: IssueCategory;
    title: string;
    description: string;
    photos: string[];
    status: IssueStatus;
    createdById: string;
    createdBy: User;
    apartmentId: string;
    apartment: Apartment;
    assignedManagerId: string;
    assignedManager: User;
    comments: IssueComment[];
    statusHistory: StatusHistory[];
    resolvedAt: Date;
}
