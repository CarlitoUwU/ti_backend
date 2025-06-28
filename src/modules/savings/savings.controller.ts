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
import { SavingsService } from './savings.service';
import { CreateSavingDto } from './dto/create-saving.dto';
import { ActivateSavingDto, DesactivateSavingDto } from './dto/update-saving.dto';
import { SavingDto } from './dto/saving.dto';
import { MonthEnum } from '../goals/dto/month.enum';

@ApiTags('savings')
@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new saving record (automatic calculation)' })
  @ApiResponse({
    status: 201,
    description: 'Saving record successfully created with automatic calculations',
    type: SavingDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - No active goal found for the specified period' })
  @ApiResponse({ status: 404, description: 'User or District not found' })
  @ApiResponse({ status: 409, description: 'Saving record already exists for this user, month, and year' })
  async create(@Body() createSavingDto: CreateSavingDto): Promise<SavingDto> {
    return this.savingsService.create(createSavingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active saving records' })
  @ApiResponse({
    status: 200,
    description: 'List of all active saving records',
    type: [SavingDto],
  })
  async findAll(): Promise<SavingDto[]> {
    return this.savingsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all saving records for a specific user' })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'List of saving records for the specified user',
    type: [SavingDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUser(@Param('userId') userId: string): Promise<SavingDto[]> {
    return this.savingsService.findByUser(userId);
  }

  @Get('user/:userId/period')
  @ApiOperation({ summary: 'Get saving records for a specific user by month and year' })
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
    description: 'List of saving records for the specified user, month and year',
    type: [SavingDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUserAndPeriod(
    @Param('userId') userId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ): Promise<SavingDto[]> {
    const yearNumber = parseInt(year, 10);
    return this.savingsService.findByUserAndPeriod(userId, month as MonthEnum, yearNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a saving record by ID' })
  @ApiParam({
    name: 'id',
    description: 'Saving UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Saving record details',
    type: SavingDto,
  })
  @ApiResponse({ status: 404, description: 'Saving record not found' })
  async findOne(@Param('id') id: string): Promise<SavingDto> {
    return this.savingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Recalculate a saving record (automatic recalculation)' })
  @ApiParam({
    name: 'id',
    description: 'Saving UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Saving record successfully recalculated',
    type: SavingDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - No active goal found for recalculation' })
  @ApiResponse({ status: 404, description: 'Saving record not found' })
  async update(
    @Param('id') id: string,
  ): Promise<SavingDto> {
    return this.savingsService.update(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a saving record' })
  @ApiParam({
    name: 'id',
    description: 'Saving UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Saving record successfully activated',
    type: ActivateSavingDto,
  })
  @ApiResponse({ status: 404, description: 'Saving record not found' })
  async activate(@Param('id') id: string): Promise<SavingDto> {
    return this.savingsService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a saving record' })
  @ApiParam({
    name: 'id',
    description: 'Saving UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Saving record successfully deactivated',
    type: DesactivateSavingDto,
  })
  @ApiResponse({ status: 404, description: 'Saving record not found' })
  async deactivate(@Param('id') id: string): Promise<SavingDto> {
    return this.savingsService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a saving record' })
  @ApiParam({
    name: 'id',
    description: 'Saving UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Saving record successfully deleted',
    type: SavingDto,
  })
  @ApiResponse({ status: 404, description: 'Saving record not found' })
  async remove(@Param('id') id: string): Promise<SavingDto> {
    return this.savingsService.remove(id);
  }
}
