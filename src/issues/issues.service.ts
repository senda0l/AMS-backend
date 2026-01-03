import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
import { RoleType } from '../roles/entities/role.entity';

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,
    @InjectRepository(IssueComment)
    private commentRepository: Repository<IssueComment>,
    @InjectRepository(StatusHistory)
    private statusHistoryRepository: Repository<StatusHistory>,
    private notificationsService: NotificationsService,
  ) {}

  async create(createIssueDto: CreateIssueDto, userId: string) {
    const issue = this.issueRepository.create({
      ...createIssueDto,
      createdById: userId,
      status: IssueStatus.NEW,
    });

    const savedIssue = await this.issueRepository.save(issue);

    // Create initial status history
    await this.createStatusHistory(savedIssue.id, IssueStatus.NEW, userId);

    // Notify apartment manager
    await this.notificationsService.createIssueNotification(savedIssue);

    return this.findOne(savedIssue.id);
  }

  async findAll(filters?: {
    status?: IssueStatus;
    category?: string;
    apartmentId?: string;
    assignedManagerId?: string;
  }) {
    const queryBuilder = this.issueRepository
      .createQueryBuilder('issue')
      .leftJoinAndSelect('issue.createdBy', 'createdBy')
      .leftJoinAndSelect('issue.apartment', 'apartment')
      .leftJoinAndSelect('apartment.entrance', 'entrance')
      .leftJoinAndSelect('entrance.building', 'building')
      .leftJoinAndSelect('issue.assignedManager', 'assignedManager')
      .leftJoinAndSelect('issue.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentUser')
      .orderBy('issue.createdAt', 'DESC');

    if (filters?.status) {
      queryBuilder.andWhere('issue.status = :status', { status: filters.status });
    }

    if (filters?.category) {
      queryBuilder.andWhere('issue.category = :category', {
        category: filters.category,
      });
    }

    if (filters?.apartmentId) {
      queryBuilder.andWhere('issue.apartmentId = :apartmentId', {
        apartmentId: filters.apartmentId,
      });
    }

    if (filters?.assignedManagerId) {
      queryBuilder.andWhere('issue.assignedManagerId = :assignedManagerId', {
        assignedManagerId: filters.assignedManagerId,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string) {
    const issue = await this.issueRepository.findOne({
      where: { id },
      relations: [
        'createdBy',
        'apartment',
        'apartment.entrance',
        'apartment.entrance.building',
        'assignedManager',
        'comments',
        'comments.user',
        'statusHistory',
        'statusHistory.changedBy',
      ],
    });

    if (!issue) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }

    return issue;
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateIssueStatusDto,
    userId: string,
    user: User,
  ) {
    const issue = await this.findOne(id);

    // Check permissions
    this.checkStatusUpdatePermission(issue, user, updateStatusDto.status);

    const oldStatus = issue.status;
    issue.status = updateStatusDto.status;

    if (updateStatusDto.assignedManagerId) {
      issue.assignedManagerId = updateStatusDto.assignedManagerId;
    }

    if (updateStatusDto.status === IssueStatus.RESOLVED) {
      issue.resolvedAt = new Date();
    }

    await this.issueRepository.save(issue);

    // Create status history
    await this.createStatusHistory(
      id,
      updateStatusDto.status,
      userId,
      updateStatusDto.notes,
    );

    // Send notifications
    if (oldStatus !== updateStatusDto.status) {
      await this.notificationsService.createStatusChangeNotification(
        issue,
        oldStatus,
        updateStatusDto.status,
      );
    }

    if (updateStatusDto.assignedManagerId) {
      await this.notificationsService.createAssignmentNotification(issue);
    }

    return this.findOne(id);
  }

  async addComment(id: string, createCommentDto: CreateCommentDto, userId: string) {
    const issue = await this.findOne(id);

    const comment = this.commentRepository.create({
      ...createCommentDto,
      issueId: id,
      userId,
    });

    await this.commentRepository.save(comment);

    // Notify relevant users
    await this.notificationsService.createCommentNotification(issue, userId);

    return this.findOne(id);
  }

  private async createStatusHistory(
    issueId: string,
    status: IssueStatus,
    userId: string,
    notes?: string,
  ) {
    const history = this.statusHistoryRepository.create({
      issueId,
      status,
      changedById: userId,
      notes,
    });

    return this.statusHistoryRepository.save(history);
  }

  private checkStatusUpdatePermission(
    issue: Issue,
    user: User,
    newStatus: IssueStatus,
  ) {
    const roleType = user.role.type;

    // Admin can do anything
    if (roleType === RoleType.ADMIN) {
      return;
    }

    // Apartment Manager can approve/reject
    if (roleType === RoleType.APARTMENT_MANAGER) {
      if (
        newStatus === IssueStatus.APPROVED ||
        newStatus === IssueStatus.REJECTED
      ) {
        return;
      }
    }

    // Service managers can update to in_progress or resolved
    if (
      [
        RoleType.GAS_MANAGER,
        RoleType.WATER_TUBES_MANAGER,
        RoleType.CLEANING_MANAGER,
      ].includes(roleType)
    ) {
      if (
        newStatus === IssueStatus.IN_PROGRESS ||
        newStatus === IssueStatus.RESOLVED
      ) {
        // Check if assigned to this manager or category matches
        if (
          issue.assignedManagerId === user.id ||
          this.isCategoryMatch(issue.category, roleType)
        ) {
          return;
        }
      }
    }

    throw new ForbiddenException(
      'You do not have permission to update this issue status',
    );
  }

  private isCategoryMatch(category: string, roleType: RoleType): boolean {
    const categoryMap = {
      [RoleType.GAS_MANAGER]: 'gas',
      [RoleType.WATER_TUBES_MANAGER]: 'water',
      [RoleType.CLEANING_MANAGER]: 'cleaning',
    };

    return categoryMap[roleType] === category;
  }
}


