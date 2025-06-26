import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PrismaService } from 'src/prisma.service';
import { NotificationBaseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class NotificationsService {

  constructor(private prisma: PrismaService) { }

  async create(createNotificationDto: CreateNotificationDto): Promise<NotificationBaseDto> {
    // Verificar que el usuario existe
    const userExists = await this.prisma.users.findUnique({
      where: { id: createNotificationDto.user_id }
    });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${createNotificationDto.user_id} not found`);
    }

    const data = await this.prisma.notifications.create({
      data: {
        user_id: createNotificationDto.user_id,
        name: createNotificationDto.name,
        description: createNotificationDto.description,
      },
      select: {
        id: true,
        user_id: true,
        name: true,
        description: true,
        created_at: true,
        was_read: true,
      }
    });

    const notification: NotificationBaseDto = {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description,
      created_at: data.created_at,
      was_read: data.was_read,
      is_active: true,
    }

    return plainToInstance(NotificationBaseDto, notification)
  }

  async findAll() {
    const data = await this.prisma.notifications.findMany({
      select: {
        id: true,
        user_id: true,
        name: true,
        description: true,
        created_at: true,
        was_read: true,
        is_active: true,
      }
    });

    const notifications: NotificationBaseDto[] = data.map(notification => ({
      id: notification.id,
      user_id: notification.user_id,
      name: notification.name,
      description: notification.description,
      created_at: notification.created_at,
      was_read: notification.was_read,
      is_active: notification.is_active,
    }));

    return plainToInstance(NotificationBaseDto, notifications);
  }

  async findOne(id: string) {
    const data = await this.prisma.notifications.findUnique({
      where: { id },
      select: {
        id: true,
        user_id: true,
        name: true,
        description: true,
        created_at: true,
        was_read: true,
        is_active: true,
      }
    });

    if (!data) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return plainToInstance(NotificationBaseDto, {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description,
      created_at: data.created_at,
      was_read: data.was_read,
      is_active: data.is_active,
    });
  }

  async findByUserId(user_id: string) {
    // Verificar que el usuario existe
    const userExists = await this.prisma.users.findUnique({
      where: { id: user_id }
    });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const data = await this.prisma.notifications.findMany({
      where: { user_id },
      select: {
        id: true,
        user_id: true,
        name: true,
        description: true,
        created_at: true,
        was_read: true,
        is_active: true,
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    const notifications: NotificationBaseDto[] = data.map(notification => ({
      id: notification.id,
      user_id: notification.user_id,
      name: notification.name,
      description: notification.description,
      created_at: notification.created_at,
      was_read: notification.was_read,
      is_active: notification.is_active,
    }));

    return plainToInstance(NotificationBaseDto, notifications);
  }

  async desactivate(id: string) {
    const existingNotification = await this.prisma.notifications.findUnique({ where: { id } });
    if (!existingNotification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    const data = await this.prisma.notifications.update({
      where: { id },
      data: { is_active: false },
      select: {
        id: true,
        user_id: true,
        name: true,
        description: true,
        created_at: true,
        was_read: true,
        is_active: true,
      }
    });

    return plainToInstance(NotificationBaseDto, {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description,
      created_at: data.created_at,
      was_read: data.was_read,
      is_active: data.is_active,
    });
  }

  async activate(id: string) {
    const existingNotification = await this.prisma.notifications.findUnique({ where: { id } });
    if (!existingNotification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    const data = await this.prisma.notifications.update({
      where: { id },
      data: { is_active: true },
      select: {
        id: true,
        user_id: true,
        name: true,
        description: true,
        created_at: true,
        was_read: true,
        is_active: true,
      }
    });

    return plainToInstance(NotificationBaseDto, {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description,
      created_at: data.created_at,
      was_read: data.was_read,
      is_active: data.is_active,
    });
  }

  async remove(id: string) {
    const existingNotification = await this.prisma.notifications.findUnique({ where: { id } });
    if (!existingNotification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    const data = await this.prisma.notifications.delete({
      where: { id },
      select: {
        id: true,
        user_id: true,
        name: true,
        description: true,
        created_at: true,
        was_read: true,
        is_active: true,
      }
    });

    return plainToInstance(NotificationBaseDto, {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description,
      created_at: data.created_at,
      was_read: data.was_read,
      is_active: data.is_active,
    });
  }

  async markAsRead(id: string) {
    const existingNotification = await this.prisma.notifications.findUnique({ where: { id } });
    if (!existingNotification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    const data = await this.prisma.notifications.update({
      where: { id },
      data: { was_read: true },
      select: {
        id: true,
        user_id: true,
        name: true,
        description: true,
        created_at: true,
        was_read: true,
        is_active: true,
      }
    });

    return plainToInstance(NotificationBaseDto, {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description,
      created_at: data.created_at,
      was_read: data.was_read,
      is_active: data.is_active,
    });
  }

  async markAsUnread(id: string) {
    const existingNotification = await this.prisma.notifications.findUnique({ where: { id } });
    if (!existingNotification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    const data = await this.prisma.notifications.update({
      where: { id },
      data: { was_read: false },
      select: {
        id: true,
        user_id: true,
        name: true,
        description: true,
        created_at: true,
        was_read: true,
        is_active: true,
      }
    });

    return plainToInstance(NotificationBaseDto, {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description,
      created_at: data.created_at,
      was_read: data.was_read,
      is_active: data.is_active,
    });
  }
}
