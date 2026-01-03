import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
export declare enum RoleType {
    ADMIN = "admin",
    APARTMENT_MANAGER = "apartment_manager",
    GAS_MANAGER = "gas_manager",
    WATER_TUBES_MANAGER = "water_tubes_manager",
    CLEANING_MANAGER = "cleaning_manager",
    APARTMENT_USER = "apartment_user"
}
export declare class Role extends BaseEntity {
    name: string;
    type: RoleType;
    description: string;
    users: User[];
}
