import { Controller, Get, Param, UseGuards, ParseEnumPipe, Put, Body, Request, Post, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleType } from '../roles/entities/role.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

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
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findOne(user.id);
  }

  @Put('profile/me')
  updateProfile(@CurrentUser() user: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Post('invite')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.APARTMENT_MANAGER)
  inviteUser(@CurrentUser() user: any, @Body() inviteUserDto: InviteUserDto) {
    return this.usersService.inviteUser(user.id, inviteUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  @HttpCode(HttpStatus.OK)
  deleteUser(@Param('id') id: string, @CurrentUser() currentUser: any) {
    return this.usersService.deleteUser(id, currentUser.id);
  }
}


