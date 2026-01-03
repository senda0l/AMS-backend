import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { CreateEntranceDto } from './dto/create-entrance.dto';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { RoleType } from '../roles/entities/role.entity';

@Controller('buildings')
@UseGuards(JwtAuthGuard)
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  createBuilding(@Body() createBuildingDto: CreateBuildingDto) {
    return this.buildingsService.createBuilding(createBuildingDto);
  }

  @Get()
  findAllBuildings() {
    return this.buildingsService.findAllBuildings();
  }

  @Get(':id')
  findOneBuilding(@Param('id') id: string) {
    return this.buildingsService.findOneBuilding(id);
  }

  @Post('entrances')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  createEntrance(@Body() createEntranceDto: CreateEntranceDto) {
    return this.buildingsService.createEntrance(createEntranceDto);
  }

  @Get('entrances/all')
  findAllEntrances(@Query('buildingId') buildingId?: string) {
    return this.buildingsService.findAllEntrances(buildingId);
  }

  @Post('apartments')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  createApartment(@Body() createApartmentDto: CreateApartmentDto) {
    return this.buildingsService.createApartment(createApartmentDto);
  }

  @Get('apartments/all')
  @Public()
  findAllApartments(@Query('entranceId') entranceId?: string) {
    return this.buildingsService.findAllApartments(entranceId);
  }

  @Get('apartments/:id')
  findOneApartment(@Param('id') id: string) {
    return this.buildingsService.findOneApartment(id);
  }
}

