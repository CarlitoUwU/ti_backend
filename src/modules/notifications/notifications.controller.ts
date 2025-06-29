import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AutomaticNotificationsService } from './automatic-notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  ActivateNotificationDto,
  DesactivateNotificationDto,
  MarkAsReadNotificationDto,
  MarkAsUnreadNotificationDto,
} from './dto/update-notification.dto';
import { ApiOperation, ApiResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { NotificationBaseDto } from './dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly automaticNotificationsService: AutomaticNotificationsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({
    status: 201,
    description: 'The notification has been successfully created.',
    type: NotificationBaseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all notifications' })
  @ApiResponse({
    status: 200,
    description: 'List of all notifications',
    type: [NotificationBaseDto],
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get('user/:user_id')
  @ApiOperation({ summary: 'Retrieve all notifications for a specific user' })
  @ApiParam({
    name: 'user_id',
    description: 'UUID of the user',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description:
      'List of notifications for the specified user (ordered by creation date, newest first)',
    type: [NotificationBaseDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findByUserId(@Param('user_id', ParseUUIDPipe) user_id: string) {
    return this.notificationsService.findByUserId(user_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a notification by ID' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully retrieved.',
    type: NotificationBaseDto,
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a notification' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully activated.',
    type: ActivateNotificationDto,
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.activate(id);
  }

  @Patch(':id/desactivate')
  @ApiOperation({ summary: 'Desactivate a notification' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully desactivated.',
    type: DesactivateNotificationDto,
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  desactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.desactivate(id);
  }

  @Patch(':id/mark-as-read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully marked as read.',
    type: MarkAsReadNotificationDto,
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  markAsRead(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch(':id/mark-as-unread')
  @ApiOperation({ summary: 'Mark a notification as unread' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully marked as unread.',
    type: MarkAsUnreadNotificationDto,
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  markAsUnread(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.markAsUnread(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully deleted.',
    type: DesactivateNotificationDto,
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.remove(id);
  }

  @Post('check-automatic/:userId')
  @ApiOperation({
    summary: 'Execute automatic notification checks for a specific user',
    description:
      'Manually triggers all automatic notification checks for a user (missing daily consumption, monthly goal, goal limits, etc.)',
  })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Automatic notification checks completed successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Automatic notification checks completed for user',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async checkAutomaticNotifications(@Param('userId', ParseUUIDPipe) userId: string) {
    await this.automaticNotificationsService.runAllChecksForUser(userId);
    return { message: 'Automatic notification checks completed for user' };
  }

  @Post('check-login/:userId')
  @ApiOperation({
    summary: 'Execute login notification checks for a specific user',
    description:
      'Executes critical notification checks when user logs in (missing goal, daily consumption after 18:00, exceeded goal)',
  })
  @ApiParam({
    name: 'userId',
    description: 'UUID of the user',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Login notification checks completed successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Login notification checks completed for user',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async checkLoginNotifications(@Param('userId', ParseUUIDPipe) userId: string) {
    await this.automaticNotificationsService.runLoginChecksForUser(userId);
    return { message: 'Login notification checks completed for user' };
  }

  @Post('check-daily-all')
  @ApiOperation({
    summary: 'Execute daily notification checks for all active users',
    description:
      'Executes daily notification checks (missing daily consumption after 18:00). Intended for cron job execution.',
  })
  @ApiResponse({
    status: 200,
    description: 'Daily notification checks completed for all users',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Daily notification checks completed for all users',
        },
      },
    },
  })
  async checkDailyNotificationsForAllUsers() {
    await this.automaticNotificationsService.runDailyChecksForAllUsers();
    return { message: 'Daily notification checks completed for all users' };
  }

  @Post('check-weekly-all')
  @ApiOperation({
    summary: 'Execute weekly notification checks for all active users',
    description:
      'Executes weekly notification checks (near goal limit, positive progress). Intended for cron job execution.',
  })
  @ApiResponse({
    status: 200,
    description: 'Weekly notification checks completed for all users',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Weekly notification checks completed for all users',
        },
      },
    },
  })
  async checkWeeklyNotificationsForAllUsers() {
    await this.automaticNotificationsService.runWeeklyChecksForAllUsers();
    return { message: 'Weekly notification checks completed for all users' };
  }

  @Post('check-month-end-all')
  @ApiOperation({
    summary: 'Execute month-end notification checks for all active users',
    description:
      'Executes month-end summary notifications. Intended for cron job execution on the last day of each month.',
  })
  @ApiResponse({
    status: 200,
    description: 'Month-end notification checks completed for all users',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Month-end notification checks completed for all users',
        },
      },
    },
  })
  async checkMonthEndNotificationsForAllUsers() {
    await this.automaticNotificationsService.runMonthEndChecksForAllUsers();
    return { message: 'Month-end notification checks completed for all users' };
  }

  @Post('check-month-start-all')
  @ApiOperation({
    summary: 'Execute month-start notification checks for all active users',
    description:
      'Executes month-start notifications (missing monthly goal reminder). Intended for cron job execution on the first day of each month.',
  })
  @ApiResponse({
    status: 200,
    description: 'Month-start notification checks completed for all users',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Month-start notification checks completed for all users',
        },
      },
    },
  })
  async checkMonthStartNotificationsForAllUsers() {
    await this.automaticNotificationsService.runMonthStartChecksForAllUsers();
    return { message: 'Month-start notification checks completed for all users' };
  }

  @Post('check-automatic-all')
  @ApiOperation({
    summary: 'Execute automatic notification checks for all active users',
    description:
      'Manually triggers all automatic notification checks for all active users in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Automatic notification checks completed for all users',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Automatic notification checks completed for all users',
        },
      },
    },
  })
  async checkAutomaticNotificationsForAllUsers() {
    await this.automaticNotificationsService.runAllChecksForAllUsers();
    return { message: 'Automatic notification checks completed for all users' };
  }
}
