import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
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
