import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Building } from './building.entity';
import { Apartment } from './apartment.entity';

@Entity('entrances')
export class Entrance extends BaseEntity {
  @Column()
  number: string;

  @Column({ type: 'uuid' })
  buildingId: string;

  @ManyToOne(() => Building, (building) => building.entrances)
  @JoinColumn({ name: 'buildingId' })
  building: Building;

  @OneToMany(() => Apartment, (apartment) => apartment.entrance)
  apartments: Apartment[];
}


