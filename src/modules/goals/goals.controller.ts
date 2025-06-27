import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalDto } from './dto/goal.dto';
import { MonthEnum } from './dto/month.enum';
import { GoalQueryDto } from './dto/goal-query.dto';

@ApiTags('Goals')
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new goal' })
  @ApiResponse({
    status: 201,
    description: 'Goal successfully created',
    type: GoalDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User or District not found' })
  async create(@Body() createGoalDto: CreateGoalDto): Promise<GoalDto> {
    return this.goalsService.create(createGoalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active goals' })
  @ApiResponse({
    status: 200,
    description: 'List of all active goals',
    type: [GoalDto],
  })
  async findAll(): Promise<GoalDto[]> {
    return this.goalsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all goals for a specific user' })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'List of goals for the specified user',
    type: [GoalDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUser(@Param('userId') userId: string): Promise<GoalDto[]> {
    return this.goalsService.findByUser(userId);
  }

  @Get('user/:userId/period')
  @ApiOperation({ summary: 'Get goals for a specific user by month and year' })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiQuery({
    name: 'month',
    description: 'Month name',
    enum: MonthEnum,
    example: 'June',
    required: true,
  })
  @ApiQuery({
    name: 'year',
    description: 'Year',
    example: 2025,
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'List of goals for the specified user, month and year',
    type: [GoalDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUserAndPeriod(
    @Param('userId') userId: string,
    @Query(new ValidationPipe({ transform: true })) query: GoalQueryDto,
  ): Promise<GoalDto[]> {
    const { month, year } = query;
    return this.goalsService.findByUserAndPeriod(userId, month, parseInt(year));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a goal by ID' })
  @ApiParam({
    name: 'id',
    description: 'Goal UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Goal details',
    type: GoalDto,
  })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<GoalDto> {
    return this.goalsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a goal' })
  @ApiParam({
    name: 'id',
    description: 'Goal UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Goal successfully updated',
    type: GoalDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGoalDto: UpdateGoalDto,
  ): Promise<GoalDto> {
    return this.goalsService.update(id, updateGoalDto);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a goal' })
  @ApiParam({
    name: 'id',
    description: 'Goal UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Goal successfully activated',
    type: GoalDto,
  })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  async activate(@Param('id', ParseUUIDPipe) id: string): Promise<GoalDto> {
    return this.goalsService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a goal' })
  @ApiParam({
    name: 'id',
    description: 'Goal UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Goal successfully deactivated',
    type: GoalDto,
  })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  async deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<GoalDto> {
    return this.goalsService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a goal' })
  @ApiParam({
    name: 'id',
    description: 'Goal UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Goal successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<GoalDto> {
    return this.goalsService.remove(id);
  }
}
