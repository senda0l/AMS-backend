import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Role } from '../../roles/entities/role.entity';
import { Apartment } from '../../buildings/entities/apartment.entity';
import { Issue } from '../../issues/entities/issue.entity';
import { Notification } from '../../notifications/entities/notification.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'uuid', nullable: true })
  roleId: string;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ type: 'uuid', nullable: true })
  apartmentId: string;

  @ManyToOne(() => Apartment, (apartment) => apartment.residents)
  @JoinColumn({ name: 'apartmentId' })
  apartment: Apartment;

  @OneToMany(() => Issue, (issue) => issue.createdBy)
  createdIssues: Issue[];

  @OneToMany(() => Issue, (issue) => issue.assignedManager)
  assignedIssues: Issue[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @Column({ default: true })
  isActive: boolean;
}


