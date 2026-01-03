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
exports.Apartment = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const entrance_entity_1 = require("./entrance.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const issue_entity_1 = require("../../issues/entities/issue.entity");
let Apartment = class Apartment extends base_entity_1.BaseEntity {
};
exports.Apartment = Apartment;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Apartment.prototype, "number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Apartment.prototype, "entranceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entrance_entity_1.Entrance, (entrance) => entrance.apartments),
    (0, typeorm_1.JoinColumn)({ name: 'entranceId' }),
    __metadata("design:type", entrance_entity_1.Entrance)
], Apartment.prototype, "entrance", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user.apartment),
    __metadata("design:type", Array)
], Apartment.prototype, "residents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => issue_entity_1.Issue, (issue) => issue.apartment),
    __metadata("design:type", Array)
], Apartment.prototype, "issues", void 0);
exports.Apartment = Apartment = __decorate([
    (0, typeorm_1.Entity)('apartments')
], Apartment);
//# sourceMappingURL=apartment.entity.js.map