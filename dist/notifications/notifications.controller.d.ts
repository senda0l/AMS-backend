import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: any): Promise<import("./entities/notification.entity").Notification[]>;
    markAsRead(id: string, req: any): Promise<import("./entities/notification.entity").Notification>;
    markAllAsRead(req: any): Promise<void>;
}
