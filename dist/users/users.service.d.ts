import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RoleType } from 'src/roles/entities/role.entity';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByRole(roleType: RoleType): Promise<User[]>;
}
