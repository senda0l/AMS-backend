import { Repository } from 'typeorm';
import { Building } from './entities/building.entity';
import { Entrance } from './entities/entrance.entity';
import { Apartment } from './entities/apartment.entity';
import { CreateBuildingDto } from './dto/create-building.dto';
import { CreateEntranceDto } from './dto/create-entrance.dto';
import { CreateApartmentDto } from './dto/create-apartment.dto';
export declare class BuildingsService {
    private buildingRepository;
    private entranceRepository;
    private apartmentRepository;
    constructor(buildingRepository: Repository<Building>, entranceRepository: Repository<Entrance>, apartmentRepository: Repository<Apartment>);
    createBuilding(createBuildingDto: CreateBuildingDto): Promise<Building>;
    findAllBuildings(): Promise<Building[]>;
    findOneBuilding(id: string): Promise<Building>;
    createEntrance(createEntranceDto: CreateEntranceDto): Promise<Entrance>;
    findAllEntrances(buildingId?: string): Promise<Entrance[]>;
    createApartment(createApartmentDto: CreateApartmentDto): Promise<Apartment>;
    findAllApartments(entranceId?: string): Promise<Apartment[]>;
    findOneApartment(id: string): Promise<Apartment>;
}
