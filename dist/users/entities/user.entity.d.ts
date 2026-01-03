import { BaseEntity } from '../../common/entities/base.entity';
import { Role } from '../../roles/entities/role.entity';
import { Apartment } from '../../buildings/entities/apartment.entity';
import { Issue } from '../../issues/entities/issue.entity';
import { Notification } from '../../notifications/entities/notification.entity';
export declare class User extends BaseEntity {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    roleId: string;
    role: Role;
    apartmentId: string;
    apartment: Apartment;
    createdIssues: Issue[];
    assignedIssues: Issue[];
    notifications: Notification[];
    isActive: boolean;
}
