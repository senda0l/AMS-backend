"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
exports.typeOrmConfig = {
    type: 'postgres',
    host: configService.get('DB_HOST') || 'localhost',
    port: configService.get('DB_PORT') || 5432,
    username: configService.get('DB_USERNAME') || 'apartment_user',
    password: configService.get('DB_PASSWORD') || 'apartment_pass',
    database: configService.get('DB_DATABASE') || 'apartment_management',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: configService.get('NODE_ENV') === 'development',
    logging: configService.get('NODE_ENV') === 'development',
};
exports.default = new typeorm_1.DataSource(exports.typeOrmConfig);
//# sourceMappingURL=typeorm.config.js.map