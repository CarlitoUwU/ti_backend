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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { MonthlyConsumptionsService } from './monthly-consumptions.service';
import { CreateMonthlyConsumptionDto } from './dto/create-monthly-consumption.dto';
import { UpdateMonthlyConsumptionDto } from './dto/update-monthly-consumption.dto';
import { MonthlyConsumptionDto } from './dto/monthly-consumption.dto';
import { MonthEnum } from '../goals/dto/month.enum';

@ApiTags('monthly-consumptions')
@Controller('monthly-consumptions')
export class MonthlyConsumptionsController {
  constructor(private readonly monthlyConsumptionsService: MonthlyConsumptionsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new monthly consumption record (automatic calculation for current month)' })
  @ApiResponse({
    status: 201,
    description: 'Monthly consumption record successfully created with automatic calculations',
    type: MonthlyConsumptionDto,
  })
  @ApiResponse({ status: 404, description: 'User or District not found' })
  @ApiResponse({ status: 409, description: 'Monthly consumption record already exists for this user and current month' })
  async create(@Body() createMonthlyConsumptionDto: CreateMonthlyConsumptionDto): Promise<MonthlyConsumptionDto> {
    return this.monthlyConsumptionsService.create(createMonthlyConsumptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active monthly consumption records' })
  @ApiResponse({
    status: 200,
    description: 'List of all active monthly consumption records',
    type: [MonthlyConsumptionDto],
  })
  async findAll(): Promise<MonthlyConsumptionDto[]> {
    return this.monthlyConsumptionsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all monthly consumption records for a specific user' })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'List of monthly consumption records for the specified user',
    type: [MonthlyConsumptionDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUser(@Param('userId') userId: string): Promise<MonthlyConsumptionDto[]> {
    return this.monthlyConsumptionsService.findByUser(userId);
  }

  @Get('user/:userId/period')
  @ApiOperation({ summary: 'Get monthly consumption records for a specific user by month and year' })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiQuery({
    name: 'month',
    description: 'Month name',
    example: 'June',
    required: true,
    enum: MonthEnum,
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
    description: 'List of monthly consumption records for the specified user, month and year',
    type: [MonthlyConsumptionDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUserAndPeriod(
    @Param('userId') userId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ): Promise<MonthlyConsumptionDto[]> {
    const yearNumber = parseInt(year, 10);
    return this.monthlyConsumptionsService.findByUserAndPeriod(userId, month as MonthEnum, yearNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a monthly consumption record by ID' })
  @ApiParam({
    name: 'id',
    description: 'Monthly consumption UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly consumption record details',
    type: MonthlyConsumptionDto,
  })
  @ApiResponse({ status: 404, description: 'Monthly consumption record not found' })
  async findOne(@Param('id') id: string): Promise<MonthlyConsumptionDto> {
    return this.monthlyConsumptionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Recalculate a monthly consumption record (automatic recalculation)' })
  @ApiParam({
    name: 'id',
    description: 'Monthly consumption UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly consumption record successfully recalculated',
    type: MonthlyConsumptionDto,
  })
  @ApiResponse({ status: 404, description: 'Monthly consumption record or user not found' })
  async update(
    @Param('id') id: string,
    @Body() updateMonthlyConsumptionDto: UpdateMonthlyConsumptionDto,
  ): Promise<MonthlyConsumptionDto> {
    return this.monthlyConsumptionsService.update(id, updateMonthlyConsumptionDto);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a monthly consumption record' })
  @ApiParam({
    name: 'id',
    description: 'Monthly consumption UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly consumption record successfully activated',
    type: MonthlyConsumptionDto,
  })
  @ApiResponse({ status: 404, description: 'Monthly consumption record not found' })
  async activate(@Param('id') id: string): Promise<MonthlyConsumptionDto> {
    return this.monthlyConsumptionsService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a monthly consumption record' })
  @ApiParam({
    name: 'id',
    description: 'Monthly consumption UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly consumption record successfully deactivated',
    type: MonthlyConsumptionDto,
  })
  @ApiResponse({ status: 404, description: 'Monthly consumption record not found' })
  async deactivate(@Param('id') id: string): Promise<MonthlyConsumptionDto> {
    return this.monthlyConsumptionsService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a monthly consumption record' })
  @ApiParam({
    name: 'id',
    description: 'Monthly consumption UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly consumption record successfully deleted',
    type: MonthlyConsumptionDto,
  })
  @ApiResponse({ status: 404, description: 'Monthly consumption record not found' })
  async remove(@Param('id') id: string): Promise<MonthlyConsumptionDto> {
    return this.monthlyConsumptionsService.remove(id);
  }
}
