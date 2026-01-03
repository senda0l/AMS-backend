import { Controller, Get, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleType } from './entities/role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get('public')
  findPublicRoles() {
    // Public endpoint for registration (no auth required)
    return this.rolesService.findPublicRoles();
  }

  @Get('type/:type')
  findByType(@Param('type') type: RoleType) {
    return this.rolesService.findByType(type);
  }
}

