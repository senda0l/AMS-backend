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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const user_entity_1 = require("../users/entities/user.entity");
let NotificationsService = class NotificationsService {
    constructor(notificationRepository, userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }
    async createIssueNotification(issue) {
        const building = issue.apartment.entrance.building;
        if (building.managerId) {
            await this.createNotification({
                type: notification_entity_1.NotificationType.ISSUE_CREATED,
                title: 'New Issue Created',
                message: `A new ${issue.category} issue has been created in ${issue.apartment.entrance.building.name}`,
                userId: building.managerId,
                relatedIssueId: issue.id,
                metadata: {
                    category: issue.category,
                    apartmentId: issue.apartmentId,
                },
            });
        }
    }
    async createStatusChangeNotification(issue, oldStatus, newStatus) {
        await this.createNotification({
            type: notification_entity_1.NotificationType.ISSUE_STATUS_CHANGED,
            title: 'Issue Status Updated',
            message: `Your issue status has been changed from ${oldStatus} to ${newStatus}`,
            userId: issue.createdById,
            relatedIssueId: issue.id,
            metadata: { oldStatus, newStatus },
        });
        if (issue.assignedManagerId) {
            await this.createNotification({
                type: notification_entity_1.NotificationType.ISSUE_STATUS_CHANGED,
                title: 'Issue Status Updated',
                message: `Issue status has been changed from ${oldStatus} to ${newStatus}`,
                userId: issue.assignedManagerId,
                relatedIssueId: issue.id,
                metadata: { oldStatus, newStatus },
            });
        }
    }
    async createAssignmentNotification(issue) {
        if (issue.assignedManagerId) {
            await this.createNotification({
                type: notification_entity_1.NotificationType.ISSUE_ASSIGNED,
                title: 'Issue Assigned to You',
                message: `You have been assigned a ${issue.category} issue: ${issue.title}`,
                userId: issue.assignedManagerId,
                relatedIssueId: issue.id,
                metadata: { category: issue.category },
            });
        }
    }
    async createCommentNotification(issue, commentUserId) {
        if (issue.createdById !== commentUserId) {
            await this.createNotification({
                type: notification_entity_1.NotificationType.COMMENT_ADDED,
                title: 'New Comment on Your Issue',
                message: `A new comment has been added to your issue: ${issue.title}`,
                userId: issue.createdById,
                relatedIssueId: issue.id,
            });
        }
        if (issue.assignedManagerId && issue.assignedManagerId !== commentUserId) {
            await this.createNotification({
                type: notification_entity_1.NotificationType.COMMENT_ADDED,
                title: 'New Comment on Assigned Issue',
                message: `A new comment has been added to issue: ${issue.title}`,
                userId: issue.assignedManagerId,
                relatedIssueId: issue.id,
            });
        }
    }
    async createApprovalNotification(issue, approved) {
        await this.createNotification({
            type: approved
                ? notification_entity_1.NotificationType.ISSUE_APPROVED
                : notification_entity_1.NotificationType.ISSUE_REJECTED,
            title: approved ? 'Issue Approved' : 'Issue Rejected',
            message: `Your issue has been ${approved ? 'approved' : 'rejected'}: ${issue.title}`,
            userId: issue.createdById,
            relatedIssueId: issue.id,
        });
    }
    async findAll(userId) {
        return this.notificationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async markAsRead(id, userId) {
        const notification = await this.notificationRepository.findOne({
            where: { id, userId },
        });
        if (notification) {
            notification.isRead = true;
            return this.notificationRepository.save(notification);
        }
        return null;
    }
    async markAllAsRead(userId) {
        await this.notificationRepository.update({ userId, isRead: false }, { isRead: true });
    }
    async createNotification(data) {
        const notification = this.notificationRepository.create(data);
        return this.notificationRepository.save(notification);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map