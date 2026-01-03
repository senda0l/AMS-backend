import { DataSource } from 'typeorm';
import { Role, RoleType } from '../../roles/entities/role.entity';

export async function seedRoles(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);

  const roles = [
    {
      name: 'Admin',
      type: RoleType.ADMIN,
      description: 'Full system access',
    },
    {
      name: 'Apartment Manager',
      type: RoleType.APARTMENT_MANAGER,
      description: 'Manages building issues and assigns service managers',
    },
    {
      name: 'Gas Manager',
      type: RoleType.GAS_MANAGER,
      description: 'Handles gas-related service requests',
    },
    {
      name: 'Water Tubes Manager',
      type: RoleType.WATER_TUBES_MANAGER,
      description: 'Manages water supply and plumbing issues',
    },
    {
      name: 'Cleaning Manager',
      type: RoleType.CLEANING_MANAGER,
      description: 'Manages cleaning-related requests',
    },
    {
      name: 'Apartment User',
      type: RoleType.APARTMENT_USER,
      description: 'Resident who can create service requests',
    },
  ];

  for (const roleData of roles) {
    const existingRole = await roleRepository.findOne({
      where: { type: roleData.type },
    });

    if (!existingRole) {
      const role = roleRepository.create(roleData);
      await roleRepository.save(role);
      console.log(`Created role: ${roleData.name}`);
    } else {
      console.log(`Role already exists: ${roleData.name}`);
    }
  }
}


