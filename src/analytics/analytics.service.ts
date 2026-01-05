import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IssueStatus } from 'src/issues/entities/issue-status.enum';
import { Issue, IssueCategory } from '../issues/entities/issue.entity';
import { Apartment } from '../buildings/entities/apartment.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,
    @InjectRepository(Apartment)
    private apartmentRepository: Repository<Apartment>,
  ) {}

  async getRequestsByCategory() {
    const issues = await this.issueRepository.find();
    
    const categoryCounts = Object.values(IssueCategory).reduce((acc, category) => {
      acc[category] = issues.filter((issue) => issue.category === category).length;
      return acc;
    }, {} as Record<IssueCategory, number>);

    return categoryCounts;
  }

  async getAverageResolutionTime() {
    const resolvedIssues = await this.issueRepository.find({
      where: { status: IssueStatus.RESOLVED },
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

  async getMostProblematicApartments(limit: number = 10) {
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
        unresolvedIssues: apartment.issues.filter(
          (issue) => issue.status !== IssueStatus.RESOLVED,
        ).length,
      }))
      .sort((a, b) => b.totalIssues - a.totalIssues)
      .slice(0, limit);

    return apartmentStats;
  }

  async getStatusDistribution() {
    const issues = await this.issueRepository.find();

    const statusCounts = Object.values(IssueStatus).reduce((acc, status) => {
      acc[status] = issues.filter((issue) => issue.status === status).length;
      return acc;
    }, {} as Record<IssueStatus, number>);

    return statusCounts;
  }

  async getCategoryResolutionStats() {
    const issues = await this.issueRepository.find({
      where: { status: IssueStatus.RESOLVED },
    });

    const categoryStats = Object.values(IssueCategory).map((category) => {
      const categoryIssues = issues.filter((issue) => issue.category === category);
      return {
        category,
        resolvedCount: categoryIssues.length,
      };
    });

    return categoryStats;
  }

  async getDashboardStats() {
    const [
      requestsByCategory,
      averageResolution,
      mostProblematic,
      statusDistribution,
    ] = await Promise.all([
      this.getRequestsByCategory(),
      this.getAverageResolutionTime(),
      this.getMostProblematicApartments(5),
      this.getStatusDistribution(),
    ]);

    const totalIssues = Object.values(statusDistribution).reduce(
      (sum, count) => sum + count,
      0,
    );

    return {
      totalIssues,
      requestsByCategory,
      averageResolution,
      mostProblematicApartments: mostProblematic,
      statusDistribution,
    };
  }

  
  async getIssueStatsByCategory() {
    const result = await this.issueRepository
      .createQueryBuilder('issue')
      .select('issue.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('issue.category')
      .getRawMany();
    
    return result.map(item => ({
      category: item.category,
      count: parseInt(item.count, 10),
    }));
  }

  async getIssueStatsByStatus() {
    const result = await this.issueRepository
      .createQueryBuilder('issue')
      .select('issue.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('issue.status')
      .getRawMany();
    
    return result.map(item => ({
      status: item.status,
      count: parseInt(item.count, 10),
    }));
  }

  async getIssueStatsByPriority() {
    const result = await this.issueRepository
      .createQueryBuilder('issue')
      .select('issue.priority', 'priority')
      .addSelect('COUNT(*)', 'count')
      .where('issue.priority IS NOT NULL')
      .groupBy('issue.priority')
      .getRawMany();
    
    return result.map(item => ({
      priority: item.priority,
      count: parseInt(item.count, 10),
    }));
  }
}


