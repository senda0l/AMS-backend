import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Entrance } from './entrance.entity';
import { User } from '../../users/entities/user.entity';

@Entity('buildings')
export class Building extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ type: 'uuid', nullable: true })
  managerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'managerId' })
  manager: User;

  @OneToMany(() => Entrance, (entrance) => entrance.building)
  entrances: Entrance[];
}


