import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IssueStatus } from '../issues/entities/issue-status.enum';
import { Issue } from '../issues/entities/issue.entity';
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
    const result = await this.issueRepository
      .createQueryBuilder('issue')
      .select('issue.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('issue.category')
      .getRawMany();

    return result.reduce((acc, item) => {
      acc[item.category] = parseInt(item.count, 10);
      return acc;
    }, {} as Record<string, number>);
  }

  async getAverageResolutionTime() {
    const result = await this.issueRepository
      .createQueryBuilder('issue')
      .select('COUNT(*)', 'totalResolved')
      .addSelect(
        'AVG(EXTRACT(EPOCH FROM (issue.resolvedAt - issue.createdAt)) / 3600)',
        'averageHours',
      )
      .where('issue.status = :status', { status: IssueStatus.RESOLVED })
      .andWhere('issue.resolvedAt IS NOT NULL')
      .getRawOne();

    const averageHours = parseFloat(result.averageHours) || 0;
    return {
      averageHours: Math.round(averageHours * 100) / 100,
      averageDays: Math.round((averageHours / 24) * 100) / 100,
      totalResolved: parseInt(result.totalResolved, 10),
    };
  }

  async getMostProblematicApartments(limit: number = 10) {
    const result = await this.apartmentRepository
      .createQueryBuilder('apartment')
      .leftJoin('apartment.entrance', 'entrance')
      .leftJoin('entrance.building', 'building')
      .leftJoin('apartment.issues', 'issue')
      .select('apartment.id', 'apartmentId')
      .addSelect('apartment.number', 'apartmentNumber')
      .addSelect('building.name', 'buildingName')
      .addSelect('entrance.number', 'entranceNumber')
      .addSelect('COUNT(issue.id)', 'totalIssues')
      .addSelect(
        `COUNT(CASE WHEN issue.status != '${IssueStatus.RESOLVED}' THEN 1 END)`,
        'unresolvedIssues',
      )
      .groupBy('apartment.id')
      .addGroupBy('apartment.number')
      .addGroupBy('building.name')
      .addGroupBy('entrance.number')
      .orderBy('"totalIssues"', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map((item) => ({
      ...item,
      totalIssues: parseInt(item.totalIssues, 10),
      unresolvedIssues: parseInt(item.unresolvedIssues, 10),
    }));
  }

  async getStatusDistribution() {
    const result = await this.issueRepository
      .createQueryBuilder('issue')
      .select('issue.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('issue.status')
      .getRawMany();

    return result.reduce((acc, item) => {
      acc[item.status] = parseInt(item.count, 10);
      return acc;
    }, {} as Record<string, number>);
  }

  async getCategoryResolutionStats() {
    const result = await this.issueRepository
      .createQueryBuilder('issue')
      .select('issue.category', 'category')
      .addSelect('COUNT(*)', 'resolvedCount')
      .where('issue.status = :status', { status: IssueStatus.RESOLVED })
      .groupBy('issue.category')
      .getRawMany();

    return result.map((item) => ({
      category: item.category,
      resolvedCount: parseInt(item.resolvedCount, 10),
    }));
  }

  async getDashboardStats() {
    const [requestsByCategory, averageResolution, mostProblematic, statusDistribution] =
      await Promise.all([
        this.getRequestsByCategory(),
        this.getAverageResolutionTime(),
        this.getMostProblematicApartments(5),
        this.getStatusDistribution(),
      ]);

    const totalIssues = Object.values(statusDistribution).reduce(
      (sum: number, count: number) => sum + count,
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

    return result.map((item) => ({
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

    return result.map((item) => ({
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

    return result.map((item) => ({
      priority: item.priority,
      count: parseInt(item.count, 10),
    }));
  }
}