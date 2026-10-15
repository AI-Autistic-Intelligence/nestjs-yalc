import { Controller, Post, Get, Roles } from '@ferrox-node/core';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

@Controller('/api/v1/notifications')
export class NotificationsController {
  private notifications: AppNotification[] = [
    {
      id: 'notif_001',
      userId: 'usr_ferrox_demo',
      title: 'Security Alert: New Sign-in',
      body: 'A new session was established from 192.168.1.50',
      read: false,
      createdAt: new Date().toISOString(),
    },
  ];

  @Get('/')
  listNotifications() {
    return {
      success: true,
      data: this.notifications,
    };
  }

  @Post('/push')
  @Roles('admin', 'founder')
  pushNotification(req: any) {
    const { userId, title, body } = req.body || {};
    const notif: AppNotification = {
      id: `notif_${Math.random().toString(36).substring(2, 9)}`,
      userId: userId || 'usr_ferrox_demo',
      title: title || 'New Notification',
      body: body || '',
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(notif);
    return { success: true, data: notif };
  }
}
