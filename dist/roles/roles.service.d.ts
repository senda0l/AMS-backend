import { Repository } from 'typeorm';
import { Role, RoleType } from './entities/role.entity';
export declare class RolesService {
    private roleRepository;
    constructor(roleRepository: Repository<Role>);
    findAll(): Promise<Role[]>;
    findByType(type: RoleType): Promise<Role>;
    findPublicRoles(): Promise<Role[]>;
}
