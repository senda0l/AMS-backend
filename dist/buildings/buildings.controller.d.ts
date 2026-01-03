import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { CreateEntranceDto } from './dto/create-entrance.dto';
import { CreateApartmentDto } from './dto/create-apartment.dto';
export declare class BuildingsController {
    private readonly buildingsService;
    constructor(buildingsService: BuildingsService);
    createBuilding(createBuildingDto: CreateBuildingDto): Promise<import("./entities/building.entity").Building>;
    findAllBuildings(): Promise<import("./entities/building.entity").Building[]>;
    findOneBuilding(id: string): Promise<import("./entities/building.entity").Building>;
    createEntrance(createEntranceDto: CreateEntranceDto): Promise<import("./entities/entrance.entity").Entrance>;
    findAllEntrances(buildingId?: string): Promise<import("./entities/entrance.entity").Entrance[]>;
    createApartment(createApartmentDto: CreateApartmentDto): Promise<import("./entities/apartment.entity").Apartment>;
    findAllApartments(entranceId?: string): Promise<import("./entities/apartment.entity").Apartment[]>;
    findOneApartment(id: string): Promise<import("./entities/apartment.entity").Apartment>;
}
