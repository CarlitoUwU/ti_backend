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
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DailyConsumptionsService } from './daily-consumptions.service';
import { CreateDailyConsumptionDto } from './dto/create-daily-consumption.dto';
import { UpdateDailyConsumptionDto } from './dto/update-daily-consumption.dto';
import { DailyConsumptionDto } from './dto/daily-consumption.dto';

@ApiTags('daily-consumptions')
@Controller('daily-consumptions')
export class DailyConsumptionsController {
  constructor(private readonly dailyConsumptionsService: DailyConsumptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new daily consumption record' })
  @ApiResponse({
    status: 201,
    description: 'Daily consumption record successfully created',
    type: DailyConsumptionDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User or Device not found' })
  @ApiResponse({
    status: 409,
    description: 'Daily consumption record already exists for this user, device, and date',
  })
  async create(
    @Body() createDailyConsumptionDto: CreateDailyConsumptionDto,
  ): Promise<DailyConsumptionDto> {
    return this.dailyConsumptionsService.create(createDailyConsumptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active daily consumption records' })
  @ApiResponse({
    status: 200,
    description: 'List of all active daily consumption records',
    type: [DailyConsumptionDto],
  })
  async findAll(): Promise<DailyConsumptionDto[]> {
    return this.dailyConsumptionsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all daily consumption records for a specific user' })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'List of daily consumption records for the specified user',
    type: [DailyConsumptionDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUser(@Param('userId') userId: string): Promise<DailyConsumptionDto[]> {
    return this.dailyConsumptionsService.findByUser(userId);
  }

  @Get('device/:deviceId')
  @ApiOperation({ summary: 'Get all daily consumption records for a specific device' })
  @ApiParam({
    name: 'deviceId',
    description: 'Device UUID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @ApiResponse({
    status: 200,
    description: 'List of daily consumption records for the specified device',
    type: [DailyConsumptionDto],
  })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async findByDevice(@Param('deviceId') deviceId: string): Promise<DailyConsumptionDto[]> {
    return this.dailyConsumptionsService.findByDevice(deviceId);
  }

  @Get('user/:userId/device/:deviceId')
  @ApiOperation({ summary: 'Get daily consumption records for a specific user and device' })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiParam({
    name: 'deviceId',
    description: 'Device UUID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @ApiResponse({
    status: 200,
    description: 'List of daily consumption records for the specified user and device',
    type: [DailyConsumptionDto],
  })
  @ApiResponse({ status: 404, description: 'User or Device not found' })
  async findByUserAndDevice(
    @Param('userId') userId: string,
    @Param('deviceId') deviceId: string,
  ): Promise<DailyConsumptionDto[]> {
    return this.dailyConsumptionsService.findByUserAndDevice(userId, deviceId);
  }

  @Get('user/:userId/date')
  @ApiOperation({ summary: 'Get daily consumption records for a specific user and date' })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiQuery({
    name: 'date',
    description: 'Date in YYYY-MM-DD format',
    example: '2025-06-26',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of daily consumption records for the specified user and date',
    type: [DailyConsumptionDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUserAndDate(
    @Param('userId') userId: string,
    @Query('date') date: string,
  ): Promise<DailyConsumptionDto[]> {
    return this.dailyConsumptionsService.findByUserAndDate(userId, date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a daily consumption record by ID' })
  @ApiParam({
    name: 'id',
    description: 'Daily consumption UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Daily consumption record details',
    type: DailyConsumptionDto,
  })
  @ApiResponse({ status: 404, description: 'Daily consumption record not found' })
  async findOne(@Param('id') id: string): Promise<DailyConsumptionDto> {
    return this.dailyConsumptionsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a daily consumption record' })
  @ApiParam({
    name: 'id',
    description: 'Daily consumption UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Daily consumption record successfully updated',
    type: DailyConsumptionDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Daily consumption record not found' })
  @ApiResponse({
    status: 409,
    description: 'Daily consumption record already exists for this user, device, and date',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDailyConsumptionDto: UpdateDailyConsumptionDto,
  ): Promise<DailyConsumptionDto> {
    return this.dailyConsumptionsService.update(id, updateDailyConsumptionDto);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a daily consumption record' })
  @ApiParam({
    name: 'id',
    description: 'Daily consumption UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Daily consumption record successfully activated',
    type: DailyConsumptionDto,
  })
  @ApiResponse({ status: 404, description: 'Daily consumption record not found' })
  async activate(@Param('id') id: string): Promise<DailyConsumptionDto> {
    return this.dailyConsumptionsService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a daily consumption record' })
  @ApiParam({
    name: 'id',
    description: 'Daily consumption UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Daily consumption record successfully deactivated',
    type: DailyConsumptionDto,
  })
  @ApiResponse({ status: 404, description: 'Daily consumption record not found' })
  async deactivate(@Param('id') id: string): Promise<DailyConsumptionDto> {
    return this.dailyConsumptionsService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a daily consumption record' })
  @ApiParam({
    name: 'id',
    description: 'Daily consumption UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Daily consumption record successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Daily consumption record not found' })
  async remove(@Param('id') id: string): Promise<DailyConsumptionDto> {
    return this.dailyConsumptionsService.remove(id);
  }
}
