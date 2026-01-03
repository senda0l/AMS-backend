import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RoleType } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll() {
    return this.roleRepository.find();
  }

  async findByType(type: RoleType) {
    return this.roleRepository.findOne({
      where: { type },
    });
  }

  async findPublicRoles() {
    // Return only apartment_user role for public registration
    return this.roleRepository.find({
      where: { type: RoleType.APARTMENT_USER },
    });
  }
}

