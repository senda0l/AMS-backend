import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Role } from '../../roles/entities/role.entity';
import { Apartment } from '../../buildings/entities/apartment.entity';
import { Issue } from '../../issues/entities/issue.entity';
import { Notification } from '../../notifications/entities/notification.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ type: 'varchar', nullable: true })
  phone!: string | null;

  @Column({ type: 'uuid', nullable: true })
  roleId!: string | null;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @Column({ type: 'uuid', nullable: true })
  apartmentId!: string | null;

  @ManyToOne(() => Apartment, (apartment) => apartment.residents)
  @JoinColumn({ name: 'apartmentId' })
  apartment!: Apartment;

  @OneToMany(() => Issue, (issue) => issue.createdBy)
  createdIssues!: Issue[];

  @OneToMany(() => Issue, (issue) => issue.assignedManager)
  assignedIssues!: Issue[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'varchar', nullable: true, unique: true })
  invitationToken!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  invitationTokenExpiresAt!: Date | null;

  @Column({ type: 'uuid', nullable: true })
  invitedById!: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'invitedById' })
  invitedBy!: User;

  @Column({ type: 'timestamp', nullable: true })
  invitedAt!: Date | null;

  @Column({ default: false })
  isInvitationPending!: boolean;

  @Column({ type: 'varchar', nullable: true })
  temporaryPassword!: string | null;
}


