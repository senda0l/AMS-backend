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
exports.BuildingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const building_entity_1 = require("./entities/building.entity");
const entrance_entity_1 = require("./entities/entrance.entity");
const apartment_entity_1 = require("./entities/apartment.entity");
let BuildingsService = class BuildingsService {
    constructor(buildingRepository, entranceRepository, apartmentRepository) {
        this.buildingRepository = buildingRepository;
        this.entranceRepository = entranceRepository;
        this.apartmentRepository = apartmentRepository;
    }
    async createBuilding(createBuildingDto) {
        const building = this.buildingRepository.create(createBuildingDto);
        return this.buildingRepository.save(building);
    }
    async findAllBuildings() {
        return this.buildingRepository.find({
            relations: ['manager', 'entrances'],
        });
    }
    async findOneBuilding(id) {
        const building = await this.buildingRepository.findOne({
            where: { id },
            relations: ['manager', 'entrances', 'entrances.apartments'],
        });
        if (!building) {
            throw new common_1.NotFoundException(`Building with ID ${id} not found`);
        }
        return building;
    }
    async createEntrance(createEntranceDto) {
        const entrance = this.entranceRepository.create(createEntranceDto);
        return this.entranceRepository.save(entrance);
    }
    async findAllEntrances(buildingId) {
        const where = buildingId ? { building: { id: buildingId } } : {};
        return this.entranceRepository.find({
            where,
            relations: ['building', 'apartments'],
        });
    }
    async createApartment(createApartmentDto) {
        const apartment = this.apartmentRepository.create(createApartmentDto);
        return this.apartmentRepository.save(apartment);
    }
    async findAllApartments(entranceId) {
        const where = entranceId ? { entrance: { id: entranceId } } : {};
        return this.apartmentRepository.find({
            where,
            relations: ['entrance', 'entrance.building', 'residents'],
        });
    }
    async findOneApartment(id) {
        const apartment = await this.apartmentRepository.findOne({
            where: { id },
            relations: ['entrance', 'entrance.building', 'residents'],
        });
        if (!apartment) {
            throw new common_1.NotFoundException(`Apartment with ID ${id} not found`);
        }
        return apartment;
    }
};
exports.BuildingsService = BuildingsService;
exports.BuildingsService = BuildingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(building_entity_1.Building)),
    __param(1, (0, typeorm_1.InjectRepository)(entrance_entity_1.Entrance)),
    __param(2, (0, typeorm_1.InjectRepository)(apartment_entity_1.Apartment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BuildingsService);
//# sourceMappingURL=buildings.service.js.map