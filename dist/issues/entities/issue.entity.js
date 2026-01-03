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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Issue = exports.IssueCategory = void 0;
const typeorm_1 = require("typeorm");
const issue_status_enum_1 = require("./issue-status.enum");
const base_entity_1 = require("../../common/entities/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const apartment_entity_1 = require("../../buildings/entities/apartment.entity");
const issue_comment_entity_1 = require("./issue-comment.entity");
const status_history_entity_1 = require("./status-history.entity");
var IssueCategory;
(function (IssueCategory) {
    IssueCategory["GAS"] = "gas";
    IssueCategory["WATER"] = "water";
    IssueCategory["CLEANING"] = "cleaning";
    IssueCategory["OTHER"] = "other";
})(IssueCategory || (exports.IssueCategory = IssueCategory = {}));
let Issue = class Issue extends base_entity_1.BaseEntity {
};
exports.Issue = Issue;
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: IssueCategory }),
    __metadata("design:type", String)
], Issue.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Issue.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Issue.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    __metadata("design:type", Array)
], Issue.prototype, "photos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: issue_status_enum_1.IssueStatus, default: issue_status_enum_1.IssueStatus.NEW }),
    __metadata("design:type", String)
], Issue.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Issue.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.createdIssues),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", user_entity_1.User)
], Issue.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Issue.prototype, "apartmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => apartment_entity_1.Apartment, (apartment) => apartment.issues),
    (0, typeorm_1.JoinColumn)({ name: 'apartmentId' }),
    __metadata("design:type", apartment_entity_1.Apartment)
], Issue.prototype, "apartment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Issue.prototype, "assignedManagerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.assignedIssues),
    (0, typeorm_1.JoinColumn)({ name: 'assignedManagerId' }),
    __metadata("design:type", user_entity_1.User)
], Issue.prototype, "assignedManager", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => issue_comment_entity_1.IssueComment, (comment) => comment.issue),
    __metadata("design:type", Array)
], Issue.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => status_history_entity_1.StatusHistory, (history) => history.issue),
    __metadata("design:type", Array)
], Issue.prototype, "statusHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Issue.prototype, "resolvedAt", void 0);
exports.Issue = Issue = __decorate([
    (0, typeorm_1.Entity)('issues')
], Issue);
//# sourceMappingURL=issue.entity.js.map