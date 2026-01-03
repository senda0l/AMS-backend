import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum RoleType {
  ADMIN = 'admin',
  APARTMENT_MANAGER = 'apartment_manager',
  GAS_MANAGER = 'gas_manager',
  WATER_TUBES_MANAGER = 'water_tubes_manager',
  CLEANING_MANAGER = 'cleaning_manager',
  APARTMENT_USER = 'apartment_user',
}

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'enum', enum: RoleType, unique: true })
  type: RoleType;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}


