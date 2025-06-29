import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersVideosService } from './users-videos.service';
import { CreateUserVideoDto } from './dto/create-user-video.dto';
import { ActivateUserVideoDto, DesactivateUserVideoDto } from './dto/update-user-video.dto';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserVideoBaseDto } from './dto';

@Controller('users-videos')
export class UsersVideosController {
  constructor(private readonly usersVideosService: UsersVideosService) {}

  @Post()
  @ApiOperation({ summary: 'Register that a user watched a video' })
  @ApiResponse({
    status: 201,
    description: 'The user-video relationship has been successfully created or updated.',
    type: UserVideoBaseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User or Video not found' })
  create(@Body() createUserVideoDto: CreateUserVideoDto) {
    return this.usersVideosService.create(createUserVideoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all user-video relationships' })
  @ApiResponse({
    status: 200,
    description: 'List of all user-video relationships (ordered by date seen, newest first)',
    type: [UserVideoBaseDto],
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findAll() {
    return this.usersVideosService.findAll();
  }

  @Get('user/:user_id')
  @ApiOperation({ summary: 'Retrieve all videos watched by a specific user' })
  @ApiParam({
    name: 'user_id',
    description: 'UUID of the user',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description:
      'List of videos watched by the specified user (ordered by date seen, newest first)',
    type: [UserVideoBaseDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findByUserId(@Param('user_id', ParseUUIDPipe) user_id: string) {
    return this.usersVideosService.findByUserId(user_id);
  }

  @Get('video/:video_id')
  @ApiOperation({ summary: 'Retrieve all users who watched a specific video' })
  @ApiParam({
    name: 'video_id',
    description: 'ID of the video',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'List of users who watched the specified video (ordered by date seen, newest first)',
    type: [UserVideoBaseDto],
  })
  @ApiResponse({ status: 404, description: 'Video not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findByVideoId(@Param('video_id', ParseIntPipe) video_id: number) {
    return this.usersVideosService.findByVideoId(video_id);
  }

  @Get('user/:user_id/video/:video_id')
  @ApiOperation({ summary: 'Check if a specific user watched a specific video' })
  @ApiParam({
    name: 'user_id',
    description: 'UUID of the user',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiParam({
    name: 'video_id',
    description: 'ID of the video',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The user-video relationship has been successfully retrieved.',
    type: UserVideoBaseDto,
  })
  @ApiResponse({ status: 404, description: 'User-Video relationship not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findOne(
    @Param('user_id', ParseUUIDPipe) user_id: string,
    @Param('video_id', ParseIntPipe) video_id: number,
  ) {
    return this.usersVideosService.findOne(user_id, video_id);
  }

  @Patch('user/:user_id/video/:video_id/activate')
  @ApiOperation({ summary: 'Activate a user-video relationship' })
  @ApiParam({
    name: 'user_id',
    description: 'UUID of the user',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiParam({
    name: 'video_id',
    description: 'ID of the video',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The user-video relationship has been successfully activated.',
    type: ActivateUserVideoDto,
  })
  @ApiResponse({ status: 404, description: 'User-Video relationship not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  activate(
    @Param('user_id', ParseUUIDPipe) user_id: string,
    @Param('video_id', ParseIntPipe) video_id: number,
  ) {
    return this.usersVideosService.activate(user_id, video_id);
  }

  @Patch('user/:user_id/video/:video_id/desactivate')
  @ApiOperation({ summary: 'Desactivate a user-video relationship' })
  @ApiParam({
    name: 'user_id',
    description: 'UUID of the user',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiParam({
    name: 'video_id',
    description: 'ID of the video',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The user-video relationship has been successfully desactivated.',
    type: DesactivateUserVideoDto,
  })
  @ApiResponse({ status: 404, description: 'User-Video relationship not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  desactivate(
    @Param('user_id', ParseUUIDPipe) user_id: string,
    @Param('video_id', ParseIntPipe) video_id: number,
  ) {
    return this.usersVideosService.desactivate(user_id, video_id);
  }

  @Delete('user/:user_id/video/:video_id')
  @ApiOperation({ summary: 'Delete a user-video relationship' })
  @ApiParam({
    name: 'user_id',
    description: 'UUID of the user',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiParam({
    name: 'video_id',
    description: 'ID of the video',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The user-video relationship has been successfully deleted.',
    type: DesactivateUserVideoDto,
  })
  @ApiResponse({ status: 404, description: 'User-Video relationship not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(
    @Param('user_id', ParseUUIDPipe) user_id: string,
    @Param('video_id', ParseIntPipe) video_id: number,
  ) {
    return this.usersVideosService.remove(user_id, video_id);
  }
}
