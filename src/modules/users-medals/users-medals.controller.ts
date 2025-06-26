import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, ParseIntPipe } from '@nestjs/common';
import { UsersMedalsService } from './users-medals.service';
import { CreateUserMedalDto } from './dto/create-user-medal.dto';
import { ActivateUserMedalDto, DesactivateUserMedalDto } from './dto/update-user-medal.dto';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserMedalBaseDto } from './dto';

@Controller('users-medals')
export class UsersMedalsController {

  constructor(private readonly usersMedalsService: UsersMedalsService) { }

  @Post()
  @ApiOperation({ summary: 'Award a medal to a user' })
  @ApiResponse({
    status: 201,
    description: 'The user-medal relationship has been successfully created or updated.',
    type: UserMedalBaseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User or Medal not found' })
  create(@Body() createUserMedalDto: CreateUserMedalDto) {
    return this.usersMedalsService.create(createUserMedalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all user-medal relationships' })
  @ApiResponse({
    status: 200,
    description: 'List of all user-medal relationships (ordered by achievement date, newest first)',
    type: [UserMedalBaseDto],
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findAll() {
    return this.usersMedalsService.findAll();
  }

  @Get('user/:user_id')
  @ApiOperation({ summary: 'Retrieve all medals earned by a specific user' })
  @ApiParam({
    name: 'user_id',
    description: 'UUID of the user',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @ApiResponse({
    status: 200,
    description: 'List of medals earned by the specified user (ordered by achievement date, newest first)',
    type: [UserMedalBaseDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findByUserId(@Param('user_id', ParseUUIDPipe) user_id: string) {
    return this.usersMedalsService.findByUserId(user_id);
  }

  @Get('medal/:medal_id')
  @ApiOperation({ summary: 'Retrieve all users who earned a specific medal' })
  @ApiParam({
    name: 'medal_id',
    description: 'ID of the medal',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'List of users who earned the specified medal (ordered by achievement date, newest first)',
    type: [UserMedalBaseDto],
  })
  @ApiResponse({ status: 404, description: 'Medal not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findByMedalId(@Param('medal_id', ParseIntPipe) medal_id: number) {
    return this.usersMedalsService.findByMedalId(medal_id);
  }

  @Get('user/:user_id/medal/:medal_id')
  @ApiOperation({ summary: 'Check if a specific user earned a specific medal' })
  @ApiParam({
    name: 'user_id',
    description: 'UUID of the user',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @ApiParam({
    name: 'medal_id',
    description: 'ID of the medal',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'The user-medal relationship has been successfully retrieved.',
    type: UserMedalBaseDto,
  })
  @ApiResponse({ status: 404, description: 'User-Medal relationship not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findOne(
    @Param('user_id', ParseUUIDPipe) user_id: string,
    @Param('medal_id', ParseIntPipe) medal_id: number
  ) {
    return this.usersMedalsService.findOne(user_id, medal_id);
  }

  @Patch('user/:user_id/medal/:medal_id/activate')
  @ApiOperation({ summary: 'Activate a user-medal relationship' })
  @ApiParam({
    name: 'user_id',
    description: 'UUID of the user',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @ApiParam({
    name: 'medal_id',
    description: 'ID of the medal',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'The user-medal relationship has been successfully activated.',
    type: ActivateUserMedalDto,
  })
  @ApiResponse({ status: 404, description: 'User-Medal relationship not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  activate(
    @Param('user_id', ParseUUIDPipe) user_id: string,
    @Param('medal_id', ParseIntPipe) medal_id: number
  ) {
    return this.usersMedalsService.activate(user_id, medal_id);
  }

  @Patch('user/:user_id/medal/:medal_id/desactivate')
  @ApiOperation({ summary: 'Desactivate a user-medal relationship' })
  @ApiParam({
    name: 'user_id',
    description: 'UUID of the user',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @ApiParam({
    name: 'medal_id',
    description: 'ID of the medal',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'The user-medal relationship has been successfully desactivated.',
    type: DesactivateUserMedalDto,
  })
  @ApiResponse({ status: 404, description: 'User-Medal relationship not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  desactivate(
    @Param('user_id', ParseUUIDPipe) user_id: string,
    @Param('medal_id', ParseIntPipe) medal_id: number
  ) {
    return this.usersMedalsService.desactivate(user_id, medal_id);
  }

  @Delete('user/:user_id/medal/:medal_id')
  @ApiOperation({ summary: 'Delete a user-medal relationship' })
  @ApiParam({
    name: 'user_id',
    description: 'UUID of the user',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @ApiParam({
    name: 'medal_id',
    description: 'ID of the medal',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'The user-medal relationship has been successfully deleted.',
    type: DesactivateUserMedalDto,
  })
  @ApiResponse({ status: 404, description: 'User-Medal relationship not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(
    @Param('user_id', ParseUUIDPipe) user_id: string,
    @Param('medal_id', ParseIntPipe) medal_id: number
  ) {
    return this.usersMedalsService.remove(user_id, medal_id);
  }
}
