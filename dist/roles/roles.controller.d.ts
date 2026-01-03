import { RolesService } from './roles.service';
import { RoleType } from './entities/role.entity';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findAll(): Promise<import("./entities/role.entity").Role[]>;
    findPublicRoles(): Promise<import("./entities/role.entity").Role[]>;
    findByType(type: RoleType): Promise<import("./entities/role.entity").Role>;
}
