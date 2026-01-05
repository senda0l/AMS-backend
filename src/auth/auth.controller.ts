import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CompleteRegistrationDto } from './dto/complete-registration.dto';
import { RolesService } from '../roles/roles.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rolesService: RolesService,
  ) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    // Keep this endpoint for backward compatibility, but it's deprecated
    // In production, you might want to remove this entirely
    return this.authService.register(registerDto);
  }

  @Post('complete-registration')
  @Public()
  async completeRegistration(@Body() completeRegistrationDto: CompleteRegistrationDto) {
    return this.authService.completeRegistration(completeRegistrationDto);
  }

  @Get('public-roles')
  @Public()
  async getPublicRoles() {
    return this.rolesService.findPublicRoles();
  }
}


