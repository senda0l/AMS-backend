import { BaseEntity } from '../../common/entities/base.entity';
import { Building } from './building.entity';
import { Apartment } from './apartment.entity';
export declare class Entrance extends BaseEntity {
    number: string;
    buildingId: string;
    building: Building;
    apartments: Apartment[];
}
