import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { MonthlyConsumptionsService } from './monthly-consumptions.service';
import { CreateMonthlyConsumptionDto } from './dto/create-monthly-consumption.dto';
import { UpdateMonthlyConsumptionDto } from './dto/update-monthly-consumption.dto';
import { MonthlyConsumptionDto } from './dto/monthly-consumption.dto';

@ApiTags('monthly-consumptions')
@Controller('monthly-consumptions')
export class MonthlyConsumptionsController {
  constructor(private readonly monthlyConsumptionsService: MonthlyConsumptionsService) { }

  @Post()
  @ApiOperation({
    summary: 'Create a new monthly consumption record',
    description: 'Creates a monthly consumption record. User provides kwh_total, kwh_cost, and amount_paid. Month and year are auto-calculated from current date using Peru timezone. Only one record per user per month is allowed.'
  })
  @ApiResponse({
    status: 201,
    description: 'Monthly consumption record successfully created',
    type: MonthlyConsumptionDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'User not found' })
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
  @ApiOperation({
    summary: 'Update a monthly consumption record',
    description: 'Updates an existing monthly consumption record. Can update kwh_total, kwh_cost, amount_paid, or is_active status. Month and year cannot be changed.'
  })
  @ApiParam({
    name: 'id',
    description: 'Monthly consumption UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly consumption record successfully updated',
    type: MonthlyConsumptionDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Monthly consumption record not found' })
  async update(
    @Param('id') id: string,
    @Body() updateMonthlyConsumptionDto: UpdateMonthlyConsumptionDto,
  ): Promise<MonthlyConsumptionDto> {
    return this.monthlyConsumptionsService.update(id, updateMonthlyConsumptionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a monthly consumption record',
    description: 'Soft deletes a monthly consumption record by setting is_active to false'
  })
  @ApiParam({
    name: 'id',
    description: 'Monthly consumption UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly consumption record successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Monthly consumption record has been successfully deleted'
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Monthly consumption record not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.monthlyConsumptionsService.remove(id);
  }
}
