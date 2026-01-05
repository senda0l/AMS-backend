import { Injectable, NotFoundException, BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { RoleType } from 'src/roles/entities/role.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { EmailService } from '../email/email.service';
import { RolesService } from '../roles/roles.service';
import { Issue } from '../issues/entities/issue.entity';
import { Notification } from '../notifications/entities/notification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private emailService: EmailService,
    private rolesService: RolesService,
  ) {}

  async findAll() {
    return this.userRepository.find({
      relations: ['role', 'apartment'],
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'apartment'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

 async findByRole(roleType: RoleType) {
  return this.userRepository.find({
    where: {
      role: {
        type: roleType,
      },
    },
    relations: ['role', 'apartment'],
  });
}

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.findOne(userId);

    // Check if email is being changed and if it's already taken
    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateProfileDto.email },
      });
      if (existingUser) {
        throw new BadRequestException('Email is already taken');
      }
      user.email = updateProfileDto.email;
    }

    if (updateProfileDto.firstName) {
      user.firstName = updateProfileDto.firstName;
    }

    if (updateProfileDto.lastName) {
      user.lastName = updateProfileDto.lastName;
    }

    if (updateProfileDto.phone !== undefined) {
      user.phone = updateProfileDto.phone || null;
    }

    if (updateProfileDto.password) {
      user.password = await bcrypt.hash(updateProfileDto.password, 10);
    }

    await this.userRepository.save(user);
    
    return this.findOne(userId);
  }

  async inviteUser(inviterId: string, inviteUserDto: InviteUserDto) {
    // Check if user with this email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: inviteUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate role exists - we'll check if role exists by trying to find it
    // Since RolesService doesn't have findOne, we'll use a workaround
    // In production, add findOne method to RolesService
    const allRoles = await this.rolesService.findAll();
    const targetRole = allRoles.find((r) => r.id === inviteUserDto.roleId);
    if (!targetRole) {
      throw new NotFoundException('Role not found');
    }

    // Validate apartment exists if provided
    if (inviteUserDto.apartmentId) {
      // Note: We'll need to inject BuildingsService or check apartment via repository
      // For now, we'll skip this validation as it requires additional dependency
      // In production, you'd want to validate this
    }

    // Generate secure invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex');

    // Generate temporary password (8 characters, alphanumeric)
    const temporaryPassword = crypto.randomBytes(4).toString('hex');

    // Hash temporary password
    const hashedTempPassword = await bcrypt.hash(temporaryPassword, 10);

    // Set expiration date (7 days from now)
    const invitationTokenExpiresAt = new Date();
    invitationTokenExpiresAt.setDate(invitationTokenExpiresAt.getDate() + 7);

    // Create user with invitation fields
    const user = this.userRepository.create({
      email: inviteUserDto.email,
      roleId: inviteUserDto.roleId,
      apartmentId: inviteUserDto.apartmentId || null,
      password: hashedTempPassword,
      firstName: 'Pending', // Placeholder, will be updated during registration
      lastName: 'User',
      invitationToken,
      invitationTokenExpiresAt,
      invitedById: inviterId,
      invitedAt: new Date(),
      isInvitationPending: true,
      isActive: false, // User is inactive until they complete registration
    });

    const savedUser = await this.userRepository.save(user);

    // Send invitation email
    await this.emailService.sendInvitationEmail(
      inviteUserDto.email,
      invitationToken,
      temporaryPassword,
    );

    // Return user without sensitive data
    const { password, temporaryPassword: _, invitationToken: __, ...result } = savedUser;
    return result;
  }

  async findByInvitationToken(token: string) {
    const user = await this.userRepository.findOne({
      where: { invitationToken: token },
      relations: ['role', 'apartment'],
    });

    if (!user) {
      throw new NotFoundException('Invalid invitation token');
    }

    if (!user.isInvitationPending) {
      throw new BadRequestException('Invitation has already been used');
    }

    if (user.invitationTokenExpiresAt && user.invitationTokenExpiresAt < new Date()) {
      throw new BadRequestException('Invitation token has expired');
    }

    return user;
  }

  async deleteUser(userId: string, currentUserId: string) {
    // Prevent self-deletion
    if (userId === currentUserId) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    const user = await this.findOne(userId);

    // Prevent deleting admin users (optional safety check)
    if (user.role?.type === RoleType.ADMIN) {
      // Check if there are other admins
      const adminCount = await this.userRepository.count({
        where: {
          role: {
            type: RoleType.ADMIN,
          },
        },
      });

      if (adminCount <= 1) {
        throw new BadRequestException('Cannot delete the last admin user');
      }
    }

    // Unassign issues assigned to this user
    await this.issueRepository.update(
      { assignedManagerId: userId },
      { assignedManagerId: null },
    );

    // Delete notifications for this user
    await this.notificationRepository.delete({ userId });

    // Delete the user
    await this.userRepository.remove(user);

    return { message: 'User deleted successfully' };
  }
}


