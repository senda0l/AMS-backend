"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const roles_seed_1 = require("./roles.seed");
const typeorm_config_1 = require("../../config/typeorm.config");
async function runSeeds() {
    const dataSource = new typeorm_1.DataSource(typeorm_config_1.typeOrmConfig);
    try {
        await dataSource.initialize();
        console.log('Database connected');
        await (0, roles_seed_1.seedRoles)(dataSource);
        console.log('Seeding completed');
        await dataSource.destroy();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        await dataSource.destroy();
        process.exit(1);
    }
}
runSeeds();
//# sourceMappingURL=seed.js.map