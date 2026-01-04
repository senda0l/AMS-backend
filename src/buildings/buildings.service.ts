import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Building } from './entities/building.entity';
import { Entrance } from './entities/entrance.entity';
import { Apartment } from './entities/apartment.entity';
import { CreateBuildingDto } from './dto/create-building.dto';
import { CreateEntranceDto } from './dto/create-entrance.dto';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { UpdateEntranceDto } from './dto/update-entrance.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    @InjectRepository(Entrance)
    private entranceRepository: Repository<Entrance>,
    @InjectRepository(Apartment)
    private apartmentRepository: Repository<Apartment>,
  ) {}

  // Buildings
  async createBuilding(createBuildingDto: CreateBuildingDto) {
    const building = this.buildingRepository.create(createBuildingDto);
    return this.buildingRepository.save(building);
  }

  async findAllBuildings() {
    return this.buildingRepository.find({
      relations: ['manager', 'entrances'],
    });
  }

  async findOneBuilding(id: string) {
    const building = await this.buildingRepository.findOne({
      where: { id },
      relations: ['manager', 'entrances', 'entrances.apartments'],
    });

    if (!building) {
      throw new NotFoundException(`Building with ID ${id} not found`);
    }

    return building;
  }

  async updateBuilding(id: string, updateBuildingDto: UpdateBuildingDto) {
    const building = await this.findOneBuilding(id);
    Object.assign(building, updateBuildingDto);
    return this.buildingRepository.save(building);
  }

  // Entrances
  async createEntrance(createEntranceDto: CreateEntranceDto) {
    const entrance = this.entranceRepository.create(createEntranceDto);
    return this.entranceRepository.save(entrance);
  }

  async findAllEntrances(buildingId?: string) {
    const where = buildingId ? { building: { id: buildingId } } : {};
    return this.entranceRepository.find({
      where,
      relations: ['building', 'apartments'],
    });
  }

  async findOneEntrance(id: string) {
    const entrance = await this.entranceRepository.findOne({
      where: { id },
      relations: ['building', 'apartments'],
    });

    if (!entrance) {
      throw new NotFoundException(`Entrance with ID ${id} not found`);
    }

    return entrance;
  }

  async updateEntrance(id: string, updateEntranceDto: UpdateEntranceDto) {
    const entrance = await this.findOneEntrance(id);
    Object.assign(entrance, updateEntranceDto);
    return this.entranceRepository.save(entrance);
  }

  // Apartments
  async createApartment(createApartmentDto: CreateApartmentDto) {
    const apartment = this.apartmentRepository.create(createApartmentDto);
    return this.apartmentRepository.save(apartment);
  }

  async findAllApartments(entranceId?: string) {
    const where = entranceId ? { entrance: { id: entranceId } } : {};
    return this.apartmentRepository.find({
      where,
      relations: ['entrance', 'entrance.building', 'residents'],
    });
  }

  async findOneApartment(id: string) {
    const apartment = await this.apartmentRepository.findOne({
      where: { id },
      relations: ['entrance', 'entrance.building', 'residents'],
    });

    if (!apartment) {
      throw new NotFoundException(`Apartment with ID ${id} not found`);
    }

    return apartment;
  }

  async updateApartment(id: string, updateApartmentDto: UpdateApartmentDto) {
    const apartment = await this.findOneApartment(id);
    Object.assign(apartment, updateApartmentDto);
    return this.apartmentRepository.save(apartment);
  }
}


