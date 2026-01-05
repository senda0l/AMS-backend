import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CompleteRegistrationDto } from './dto/complete-registration.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role', 'apartment'],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const payload = { email: user.email, sub: user.id, role: user.role.type };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        apartment: user.apartment,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    const { password: _, ...result } = savedUser;

    return result;
  }

  async completeRegistration(completeRegistrationDto: CompleteRegistrationDto) {
    // Find user by invitation token
    const user = await this.usersService.findByInvitationToken(completeRegistrationDto.token);

    if (!user) {
      throw new NotFoundException('Invalid or expired invitation token');
    }

    // Validate that token matches
    if (user.invitationToken !== completeRegistrationDto.token) {
      throw new BadRequestException('Invalid invitation token');
    }

    // Check if token is expired
    if (user.invitationTokenExpiresAt && user.invitationTokenExpiresAt < new Date()) {
      throw new BadRequestException('Invitation token has expired');
    }

    // Check if invitation is still pending
    if (!user.isInvitationPending) {
      throw new BadRequestException('Invitation has already been used');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(completeRegistrationDto.password, 10);

    // Update user with registration details
    user.firstName = completeRegistrationDto.firstName;
    user.lastName = completeRegistrationDto.lastName;
    user.phone = completeRegistrationDto.phone || null;
    user.password = hashedPassword;
    user.isInvitationPending = false;
    user.isActive = true;
    user.invitationToken = null; // Clear the token
    user.invitationTokenExpiresAt = null;
    user.temporaryPassword = null; // Clear temporary password

    const savedUser = await this.userRepository.save(user);

    // Return user without sensitive data
    const { password: _, temporaryPassword: __, invitationToken: ___, ...result } = savedUser;

    return {
      message: 'Registration completed successfully. You can now login.',
      user: result,
    };
  }
}


