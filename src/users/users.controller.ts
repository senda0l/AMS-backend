import { Controller, Get, Param, ParseEnumPipe, Put, Body, Post, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleType } from '../roles/entities/role.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(RoleType.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile/me')
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findOne(user.id);
  }

  @Put('profile/me')
  updateProfile(@CurrentUser() user: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Get('role/:roleType')
  @Roles(RoleType.ADMIN, RoleType.APARTMENT_MANAGER)
  findByRole(
    @Param('roleType', new ParseEnumPipe(RoleType))
    roleType: RoleType,
  ) {
    return this.usersService.findByRole(roleType);
  }

  @Post('invite')
  @Roles(RoleType.ADMIN, RoleType.APARTMENT_MANAGER)
  inviteUser(@CurrentUser() user: any, @Body() inviteUserDto: InviteUserDto) {
    return this.usersService.inviteUser(user.id, inviteUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN)
  @HttpCode(HttpStatus.OK)
  deleteUser(@Param('id') id: string, @CurrentUser() currentUser: any) {
    return this.usersService.deleteUser(id, currentUser.id);
  }
}


