import { Controller, Get, Param, UseGuards, ParseEnumPipe, Put, Body, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleType } from '../roles/entities/role.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('role/:roleType')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.APARTMENT_MANAGER)
  findByRole(
    @Param('roleType', new ParseEnumPipe(RoleType))
    roleType: RoleType,
  ) {
    return this.usersService.findByRole(roleType);
  }

  @Get('profile/me')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Put('profile/me')
  updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
  }
}


