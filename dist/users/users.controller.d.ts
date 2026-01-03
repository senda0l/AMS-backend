import { UsersService } from './users.service';
import { RoleType } from '../roles/entities/role.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    findByRole(roleType: RoleType): Promise<import("./entities/user.entity").User[]>;
}
