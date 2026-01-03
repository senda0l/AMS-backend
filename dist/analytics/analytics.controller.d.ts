import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardStats(): Promise<{
        totalIssues: number;
        requestsByCategory: Record<import("../issues/entities/issue.entity").IssueCategory, number>;
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
        statusDistribution: Record<import("../issues/entities/issue-status.enum").IssueStatus, number>;
    }>;
    getRequestsByCategory(): Promise<Record<import("../issues/entities/issue.entity").IssueCategory, number>>;
    getAverageResolutionTime(): Promise<{
        averageHours: number;
        averageDays: number;
        totalResolved?: undefined;
    } | {
        averageHours: number;
        averageDays: number;
        totalResolved: number;
    }>;
    getMostProblematicApartments(limit?: string): Promise<{
        apartmentId: string;
        apartmentNumber: string;
        buildingName: string;
        entranceNumber: string;
        totalIssues: number;
        unresolvedIssues: number;
    }[]>;
    getStatusDistribution(): Promise<Record<import("../issues/entities/issue-status.enum").IssueStatus, number>>;
    getCategoryResolutionStats(): Promise<{
        category: import("../issues/entities/issue.entity").IssueCategory;
        resolvedCount: number;
    }[]>;
}
