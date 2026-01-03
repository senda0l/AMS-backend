"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedRoles = seedRoles;
const role_entity_1 = require("../../roles/entities/role.entity");
async function seedRoles(dataSource) {
    const roleRepository = dataSource.getRepository(role_entity_1.Role);
    const roles = [
        {
            name: 'Admin',
            type: role_entity_1.RoleType.ADMIN,
            description: 'Full system access',
        },
        {
            name: 'Apartment Manager',
            type: role_entity_1.RoleType.APARTMENT_MANAGER,
            description: 'Manages building issues and assigns service managers',
        },
        {
            name: 'Gas Manager',
            type: role_entity_1.RoleType.GAS_MANAGER,
            description: 'Handles gas-related service requests',
        },
        {
            name: 'Water Tubes Manager',
            type: role_entity_1.RoleType.WATER_TUBES_MANAGER,
            description: 'Manages water supply and plumbing issues',
        },
        {
            name: 'Cleaning Manager',
            type: role_entity_1.RoleType.CLEANING_MANAGER,
            description: 'Manages cleaning-related requests',
        },
        {
            name: 'Apartment User',
            type: role_entity_1.RoleType.APARTMENT_USER,
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
        }
        else {
            console.log(`Role already exists: ${roleData.name}`);
        }
    }
}
//# sourceMappingURL=roles.seed.js.map