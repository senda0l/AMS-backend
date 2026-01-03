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
exports.StatusHistory = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const issue_entity_1 = require("./issue.entity");
const issue_status_enum_1 = require("./issue-status.enum");
const user_entity_1 = require("../../users/entities/user.entity");
let StatusHistory = class StatusHistory extends base_entity_1.BaseEntity {
};
exports.StatusHistory = StatusHistory;
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: issue_status_enum_1.IssueStatus,
        enumName: 'issue_status_enum',
    }),
    __metadata("design:type", String)
], StatusHistory.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], StatusHistory.prototype, "issueId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => issue_entity_1.Issue, (issue) => issue.statusHistory),
    (0, typeorm_1.JoinColumn)({ name: 'issueId' }),
    __metadata("design:type", issue_entity_1.Issue)
], StatusHistory.prototype, "issue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], StatusHistory.prototype, "changedById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'changedById' }),
    __metadata("design:type", user_entity_1.User)
], StatusHistory.prototype, "changedBy", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], StatusHistory.prototype, "notes", void 0);
exports.StatusHistory = StatusHistory = __decorate([
    (0, typeorm_1.Entity)('status_history')
], StatusHistory);
//# sourceMappingURL=status-history.entity.js.map