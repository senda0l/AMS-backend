import { Repository } from 'typeorm';
import { IssueStatus } from 'src/issues/entities/issue-status.enum';
import { Issue, IssueCategory } from '../issues/entities/issue.entity';
import { Apartment } from '../buildings/entities/apartment.entity';
export declare class AnalyticsService {
    private issueRepository;
    private apartmentRepository;
    constructor(issueRepository: Repository<Issue>, apartmentRepository: Repository<Apartment>);
    getRequestsByCategory(): Promise<Record<IssueCategory, number>>;
    getAverageResolutionTime(): Promise<{
        averageHours: number;
        averageDays: number;
        totalResolved?: undefined;
    } | {
        averageHours: number;
        averageDays: number;
        totalResolved: number;
    }>;
    getMostProblematicApartments(limit?: number): Promise<{
        apartmentId: string;
        apartmentNumber: string;
        buildingName: string;
        entranceNumber: string;
        totalIssues: number;
        unresolvedIssues: number;
    }[]>;
    getStatusDistribution(): Promise<Record<IssueStatus, number>>;
    getCategoryResolutionStats(): Promise<{
        category: IssueCategory;
        resolvedCount: number;
    }[]>;
    getDashboardStats(): Promise<{
        totalIssues: number;
        requestsByCategory: Record<IssueCategory, number>;
        averageResolution: {
            averageHours: number;
            averageDays: number;
            totalResolved?: undefined;
        } | {
            averageHours: number;
            averageDays: number;
            totalResolved: number;
        };
        mostProblematicApartments: {
            apartmentId: string;
            apartmentNumber: string;
            buildingName: string;
            entranceNumber: string;
            totalIssues: number;
            unresolvedIssues: number;
        }[];
        statusDistribution: Record<IssueStatus, number>;
    }>;
}
