import { BaseEntity } from '../../common/entities/base.entity';
import { Entrance } from './entrance.entity';
import { User } from '../../users/entities/user.entity';
import { Issue } from '../../issues/entities/issue.entity';
export declare class Apartment extends BaseEntity {
    number: string;
    entranceId: string;
    entrance: Entrance;
    residents: User[];
    issues: Issue[];
}
