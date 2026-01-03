"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperUser = seedSuperUser;
const typeorm_1 = require("typeorm");
const bcrypt_1 = __importDefault(require("bcrypt"));
const typeorm_config_1 = require("../../config/typeorm.config");
const user_entity_1 = require("../../users/entities/user.entity");
const role_entity_1 = require("../../roles/entities/role.entity");
async function seedSuperUser(dataSource) {
    try {
        const userRepository = dataSource.getRepository(user_entity_1.User);
        const roleRepository = dataSource.getRepository(role_entity_1.Role);
        const apartmentUserRole = await roleRepository.findOne({
            where: { type: role_entity_1.RoleType.APARTMENT_USER },
        });
        if (!apartmentUserRole) {
            throw new Error('Role apartment_user not found. Run roles seed first.');
        }
        const existingUser = await userRepository.findOne({
            where: { email: 'superuser@example.com' },
        });
        if (existingUser) {
            console.log('Superuser already exists');
            return;
        }
        const user = new user_entity_1.User();
        user.firstName = 'Super';
        user.lastName = 'User';
        user.email = 'superuser@example.com';
        user.password = await bcrypt_1.default.hash('superpassword', 10);
        user.role = apartmentUserRole;
        user.isActive = true;
        await userRepository.save(user);
        console.log('Superuser created');
    }
    catch (err) {
        console.error('Error seeding superuser:', err);
    }
}
const dataSource = new typeorm_1.DataSource(typeorm_config_1.typeOrmConfig);
if (require.main === module) {
    dataSource.initialize()
        .then(() => seedSuperUser(dataSource))
        .then(() => dataSource.destroy());
}
//# sourceMappingURL=superuser.seed.js.map