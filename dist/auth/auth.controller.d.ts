import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            apartment: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        roleId: string;
        role: import("../roles/entities/role.entity").Role;
        apartmentId: string;
        apartment: import("../buildings/entities/apartment.entity").Apartment;
        createdIssues: import("../issues/entities/issue.entity").Issue[];
        assignedIssues: import("../issues/entities/issue.entity").Issue[];
        notifications: import("../notifications/entities/notification.entity").Notification[];
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
