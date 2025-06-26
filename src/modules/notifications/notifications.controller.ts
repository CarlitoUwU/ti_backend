import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ActivateNotificationDto, DesactivateNotificationDto, MarkAsReadNotificationDto, MarkAsUnreadNotificationDto } from './dto/update-notification.dto';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { NotificationBaseDto } from './dto';

@Controller('notifications')
export class NotificationsController {

  constructor(private readonly notificationsService: NotificationsService) { }

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
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @ApiResponse({
    status: 200,
    description: 'List of notifications for the specified user (ordered by creation date, newest first)',
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
}
