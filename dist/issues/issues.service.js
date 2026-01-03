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
exports.IssuesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const issue_status_enum_1 = require("./entities/issue-status.enum");
const issue_entity_1 = require("./entities/issue.entity");
const issue_comment_entity_1 = require("./entities/issue-comment.entity");
const status_history_entity_1 = require("./entities/status-history.entity");
const notifications_service_1 = require("../notifications/notifications.service");
const role_entity_1 = require("../roles/entities/role.entity");
let IssuesService = class IssuesService {
    constructor(issueRepository, commentRepository, statusHistoryRepository, notificationsService) {
        this.issueRepository = issueRepository;
        this.commentRepository = commentRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.notificationsService = notificationsService;
    }
    async create(createIssueDto, userId) {
        const issue = this.issueRepository.create({
            ...createIssueDto,
            createdById: userId,
            status: issue_status_enum_1.IssueStatus.NEW,
        });
        const savedIssue = await this.issueRepository.save(issue);
        await this.createStatusHistory(savedIssue.id, issue_status_enum_1.IssueStatus.NEW, userId);
        await this.notificationsService.createIssueNotification(savedIssue);
        return this.findOne(savedIssue.id);
    }
    async findAll(filters) {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Issue with ID ${id} not found`);
        }
        return issue;
    }
    async updateStatus(id, updateStatusDto, userId, user) {
        const issue = await this.findOne(id);
        this.checkStatusUpdatePermission(issue, user, updateStatusDto.status);
        const oldStatus = issue.status;
        issue.status = updateStatusDto.status;
        if (updateStatusDto.assignedManagerId) {
            issue.assignedManagerId = updateStatusDto.assignedManagerId;
        }
        if (updateStatusDto.status === issue_status_enum_1.IssueStatus.RESOLVED) {
            issue.resolvedAt = new Date();
        }
        await this.issueRepository.save(issue);
        await this.createStatusHistory(id, updateStatusDto.status, userId, updateStatusDto.notes);
        if (oldStatus !== updateStatusDto.status) {
            await this.notificationsService.createStatusChangeNotification(issue, oldStatus, updateStatusDto.status);
        }
        if (updateStatusDto.assignedManagerId) {
            await this.notificationsService.createAssignmentNotification(issue);
        }
        return this.findOne(id);
    }
    async addComment(id, createCommentDto, userId) {
        const issue = await this.findOne(id);
        const comment = this.commentRepository.create({
            ...createCommentDto,
            issueId: id,
            userId,
        });
        await this.commentRepository.save(comment);
        await this.notificationsService.createCommentNotification(issue, userId);
        return this.findOne(id);
    }
    async createStatusHistory(issueId, status, userId, notes) {
        const history = this.statusHistoryRepository.create({
            issueId,
            status,
            changedById: userId,
            notes,
        });
        return this.statusHistoryRepository.save(history);
    }
    checkStatusUpdatePermission(issue, user, newStatus) {
        const roleType = user.role.type;
        if (roleType === role_entity_1.RoleType.ADMIN) {
            return;
        }
        if (roleType === role_entity_1.RoleType.APARTMENT_MANAGER) {
            if (newStatus === issue_status_enum_1.IssueStatus.APPROVED ||
                newStatus === issue_status_enum_1.IssueStatus.REJECTED) {
                return;
            }
        }
        if ([
            role_entity_1.RoleType.GAS_MANAGER,
            role_entity_1.RoleType.WATER_TUBES_MANAGER,
            role_entity_1.RoleType.CLEANING_MANAGER,
        ].includes(roleType)) {
            if (newStatus === issue_status_enum_1.IssueStatus.IN_PROGRESS ||
                newStatus === issue_status_enum_1.IssueStatus.RESOLVED) {
                if (issue.assignedManagerId === user.id ||
                    this.isCategoryMatch(issue.category, roleType)) {
                    return;
                }
            }
        }
        throw new common_1.ForbiddenException('You do not have permission to update this issue status');
    }
    isCategoryMatch(category, roleType) {
        const categoryMap = {
            [role_entity_1.RoleType.GAS_MANAGER]: 'gas',
            [role_entity_1.RoleType.WATER_TUBES_MANAGER]: 'water',
            [role_entity_1.RoleType.CLEANING_MANAGER]: 'cleaning',
        };
        return categoryMap[roleType] === category;
    }
};
exports.IssuesService = IssuesService;
exports.IssuesService = IssuesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(issue_entity_1.Issue)),
    __param(1, (0, typeorm_1.InjectRepository)(issue_comment_entity_1.IssueComment)),
    __param(2, (0, typeorm_1.InjectRepository)(status_history_entity_1.StatusHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], IssuesService);
//# sourceMappingURL=issues.service.js.map