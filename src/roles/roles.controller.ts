import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleType } from './entities/role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles(RoleType.ADMIN, RoleType.APARTMENT_MANAGER)
  findAll() {
    return this.rolesService.findAll();
  }
}

