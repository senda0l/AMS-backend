"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const issue_status_enum_1 = require("../issues/entities/issue-status.enum");
const issue_entity_1 = require("../issues/entities/issue.entity");
const apartment_entity_1 = require("../buildings/entities/apartment.entity");
let AnalyticsService = class AnalyticsService {
    constructor(issueRepository, apartmentRepository) {
        this.issueRepository = issueRepository;
        this.apartmentRepository = apartmentRepository;
    }
    async getRequestsByCategory() {
        const issues = await this.issueRepository.find();
        const categoryCounts = Object.values(issue_entity_1.IssueCategory).reduce((acc, category) => {
            acc[category] = issues.filter((issue) => issue.category === category).length;
            return acc;
        }, {});
        return categoryCounts;
    }
    async getAverageResolutionTime() {
        const resolvedIssues = await this.issueRepository.find({
            where: { status: issue_status_enum_1.IssueStatus.RESOLVED },
            relations: ['statusHistory'],
        });
        if (resolvedIssues.length === 0) {
            return { averageHours: 0, averageDays: 0 };
        }
        let totalHours = 0;
        let count = 0;
        for (const issue of resolvedIssues) {
            if (issue.resolvedAt && issue.createdAt) {
                const diffMs = issue.resolvedAt.getTime() - issue.createdAt.getTime();
                const diffHours = diffMs / (1000 * 60 * 60);
                totalHours += diffHours;
                count++;
            }
        }
        const averageHours = count > 0 ? totalHours / count : 0;
        const averageDays = averageHours / 24;
        return {
            averageHours: Math.round(averageHours * 100) / 100,
            averageDays: Math.round(averageDays * 100) / 100,
            totalResolved: count,
        };
    }
    async getMostProblematicApartments(limit = 10) {
        const apartments = await this.apartmentRepository.find({
            relations: ['issues', 'entrance', 'entrance.building'],
        });
        const apartmentStats = apartments
            .map((apartment) => ({
            apartmentId: apartment.id,
            apartmentNumber: apartment.number,
            buildingName: apartment.entrance.building.name,
            entranceNumber: apartment.entrance.number,
            totalIssues: apartment.issues.length,
            unresolvedIssues: apartment.issues.filter((issue) => issue.status !== issue_status_enum_1.IssueStatus.RESOLVED).length,
        }))
            .sort((a, b) => b.totalIssues - a.totalIssues)
            .slice(0, limit);
        return apartmentStats;
    }
    async getStatusDistribution() {
        const issues = await this.issueRepository.find();
        const statusCounts = Object.values(issue_status_enum_1.IssueStatus).reduce((acc, status) => {
            acc[status] = issues.filter((issue) => issue.status === status).length;
            return acc;
        }, {});
        return statusCounts;
    }
    async getCategoryResolutionStats() {
        const issues = await this.issueRepository.find({
            where: { status: issue_status_enum_1.IssueStatus.RESOLVED },
        });
        const categoryStats = Object.values(issue_entity_1.IssueCategory).map((category) => {
            const categoryIssues = issues.filter((issue) => issue.category === category);
            return {
                category,
                resolvedCount: categoryIssues.length,
            };
        });
        return categoryStats;
    }
    async getDashboardStats() {
        const [requestsByCategory, averageResolution, mostProblematic, statusDistribution,] = await Promise.all([
            this.getRequestsByCategory(),
            this.getAverageResolutionTime(),
            this.getMostProblematicApartments(5),
            this.getStatusDistribution(),
        ]);
        const totalIssues = Object.values(statusDistribution).reduce((sum, count) => sum + count, 0);
        return {
            totalIssues,
            requestsByCategory,
            averageResolution,
            mostProblematicApartments: mostProblematic,
            statusDistribution,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(issue_entity_1.Issue)),
    __param(1, (0, typeorm_1.InjectRepository)(apartment_entity_1.Apartment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map