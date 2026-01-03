import { BaseEntity } from '../../common/entities/base.entity';
import { Entrance } from './entrance.entity';
import { User } from '../../users/entities/user.entity';
export declare class Building extends BaseEntity {
    name: string;
    address: string;
    city: string;
    managerId: string;
    manager: User;
    entrances: Entrance[];
}
