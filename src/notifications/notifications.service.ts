import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { Issue } from '../issues/entities/issue.entity';
import { IssueStatus } from 'src/issues/entities/issue-status.enum';
import { User } from '../users/entities/user.entity';
import { RoleType } from '../roles/entities/role.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async createIssueNotification(issue: Issue) {
    // Notify apartment manager of the building
    if (
      issue.apartment?.entrance?.building?.managerId
    ) {
      const building = issue.apartment.entrance.building;
      const manager = await this.userRepository.findOne({
        where: { id: building.managerId },
      });

      await this.createNotification({
        type: NotificationType.ISSUE_CREATED,
        title: 'New Issue Created',
        message: `A new ${issue.category} issue has been created in ${building.name || 'the building'}`,
        userId: building.managerId,
        relatedIssueId: issue.id,
        metadata: {
          category: issue.category,
          apartmentId: issue.apartmentId,
        },
      });

      // Send email to manager
      if (manager?.email) {
        await this.emailService.sendIssueCreatedEmail(
          manager.email,
          issue.title,
          issue.category,
          building.name || 'the building',
        );
      }
    }
  }

  async createStatusChangeNotification(
    issue: Issue,
    oldStatus: IssueStatus,
    newStatus: IssueStatus,
  ) {
    // Notify the creator
    const creator = await this.userRepository.findOne({
      where: { id: issue.createdById },
    });

    await this.createNotification({
      type: NotificationType.ISSUE_STATUS_CHANGED,
      title: 'Issue Status Updated',
      message: `Your issue status has been changed from ${oldStatus} to ${newStatus}`,
      userId: issue.createdById,
      relatedIssueId: issue.id,
      metadata: { oldStatus, newStatus },
    });

    // Send email to creator
    if (creator?.email) {
      await this.emailService.sendIssueStatusChangeEmail(
        creator.email,
        issue.title,
        oldStatus,
        newStatus,
        issue.id,
      );
    }

    // Notify assigned manager if exists
    if (issue.assignedManagerId) {
      const manager = await this.userRepository.findOne({
        where: { id: issue.assignedManagerId },
      });

      await this.createNotification({
        type: NotificationType.ISSUE_STATUS_CHANGED,
        title: 'Issue Status Updated',
        message: `Issue status has been changed from ${oldStatus} to ${newStatus}`,
        userId: issue.assignedManagerId,
        relatedIssueId: issue.id,
        metadata: { oldStatus, newStatus },
      });

      // Send email to manager
      if (manager?.email) {
        await this.emailService.sendIssueStatusChangeEmail(
          manager.email,
          issue.title,
          oldStatus,
          newStatus,
          issue.id,
        );
      }
    }
  }

  async createAssignmentNotification(issue: Issue) {
    if (issue.assignedManagerId) {
      const manager = await this.userRepository.findOne({
        where: { id: issue.assignedManagerId },
      });

      await this.createNotification({
        type: NotificationType.ISSUE_ASSIGNED,
        title: 'Issue Assigned to You',
        message: `You have been assigned a ${issue.category} issue: ${issue.title}`,
        userId: issue.assignedManagerId,
        relatedIssueId: issue.id,
        metadata: { category: issue.category },
      });

      // Send email to manager
      if (manager?.email) {
        await this.emailService.sendIssueAssignedEmail(
          manager.email,
          issue.title,
          issue.id,
        );
      }
    }
  }

  async createCommentNotification(issue: Issue, commentUserId: string) {
    // Notify issue creator (if not the commenter)
    if (issue.createdById !== commentUserId) {
      await this.createNotification({
        type: NotificationType.COMMENT_ADDED,
        title: 'New Comment on Your Issue',
        message: `A new comment has been added to your issue: ${issue.title}`,
        userId: issue.createdById,
        relatedIssueId: issue.id,
      });
    }

    // Notify assigned manager (if exists and not the commenter)
    if (issue.assignedManagerId && issue.assignedManagerId !== commentUserId) {
      await this.createNotification({
        type: NotificationType.COMMENT_ADDED,
        title: 'New Comment on Assigned Issue',
        message: `A new comment has been added to issue: ${issue.title}`,
        userId: issue.assignedManagerId,
        relatedIssueId: issue.id,
      });
    }
  }

  async createApprovalNotification(issue: Issue, approved: boolean) {
    await this.createNotification({
      type: approved
        ? NotificationType.ISSUE_APPROVED
        : NotificationType.ISSUE_REJECTED,
      title: approved ? 'Issue Approved' : 'Issue Rejected',
      message: `Your issue has been ${approved ? 'approved' : 'rejected'}: ${issue.title}`,
      userId: issue.createdById,
      relatedIssueId: issue.id,
    });
  }

  async findAll(userId: string) {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });

    if (notification) {
      notification.isRead = true;
      return this.notificationRepository.save(notification);
    }

    return null;
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  private async createNotification(data: {
    type: NotificationType;
    title: string;
    message: string;
    userId: string;
    relatedIssueId?: string;
    metadata?: Record<string, any>;
  }) {
    const notification = this.notificationRepository.create(data);
    return this.notificationRepository.save(notification);
  }
}


