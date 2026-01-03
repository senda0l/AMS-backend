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
exports.BuildingsController = void 0;
const common_1 = require("@nestjs/common");
const buildings_service_1 = require("./buildings.service");
const create_building_dto_1 = require("./dto/create-building.dto");
const create_entrance_dto_1 = require("./dto/create-entrance.dto");
const create_apartment_dto_1 = require("./dto/create-apartment.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const role_entity_1 = require("../roles/entities/role.entity");
let BuildingsController = class BuildingsController {
    constructor(buildingsService) {
        this.buildingsService = buildingsService;
    }
    createBuilding(createBuildingDto) {
        return this.buildingsService.createBuilding(createBuildingDto);
    }
    findAllBuildings() {
        return this.buildingsService.findAllBuildings();
    }
    findOneBuilding(id) {
        return this.buildingsService.findOneBuilding(id);
    }
    createEntrance(createEntranceDto) {
        return this.buildingsService.createEntrance(createEntranceDto);
    }
    findAllEntrances(buildingId) {
        return this.buildingsService.findAllEntrances(buildingId);
    }
    createApartment(createApartmentDto) {
        return this.buildingsService.createApartment(createApartmentDto);
    }
    findAllApartments(entranceId) {
        return this.buildingsService.findAllApartments(entranceId);
    }
    findOneApartment(id) {
        return this.buildingsService.findOneApartment(id);
    }
};
exports.BuildingsController = BuildingsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_building_dto_1.CreateBuildingDto]),
    __metadata("design:returntype", void 0)
], BuildingsController.prototype, "createBuilding", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BuildingsController.prototype, "findAllBuildings", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BuildingsController.prototype, "findOneBuilding", null);
__decorate([
    (0, common_1.Post)('entrances'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_entrance_dto_1.CreateEntranceDto]),
    __metadata("design:returntype", void 0)
], BuildingsController.prototype, "createEntrance", null);
__decorate([
    (0, common_1.Get)('entrances/all'),
    __param(0, (0, common_1.Query)('buildingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BuildingsController.prototype, "findAllEntrances", null);
__decorate([
    (0, common_1.Post)('apartments'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_apartment_dto_1.CreateApartmentDto]),
    __metadata("design:returntype", void 0)
], BuildingsController.prototype, "createApartment", null);
__decorate([
    (0, common_1.Get)('apartments/all'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)('entranceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BuildingsController.prototype, "findAllApartments", null);
__decorate([
    (0, common_1.Get)('apartments/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BuildingsController.prototype, "findOneApartment", null);
exports.BuildingsController = BuildingsController = __decorate([
    (0, common_1.Controller)('buildings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [buildings_service_1.BuildingsService])
], BuildingsController);
//# sourceMappingURL=buildings.controller.js.map