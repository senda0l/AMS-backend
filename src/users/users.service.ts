import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RoleType } from 'src/roles/entities/role.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
}


