import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Entrance } from './entrance.entity';
import { User } from '../../users/entities/user.entity';
import { Issue } from '../../issues/entities/issue.entity';

@Entity('apartments')
export class Apartment extends BaseEntity {
  @Column()
  number: string;

  @Column({ type: 'uuid' })
  entranceId: string;

  @ManyToOne(() => Entrance, (entrance) => entrance.apartments)
  @JoinColumn({ name: 'entranceId' })
  entrance: Entrance;

  @OneToMany(() => User, (user) => user.apartment)
  residents: User[];

  @OneToMany(() => Issue, (issue) => issue.apartment)
  issues: Issue[];
}


