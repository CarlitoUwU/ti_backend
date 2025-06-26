import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { MedalsService } from './medals.service';
import { CreateMedalDto } from './dto/create-medal.dto';
import { ActivateMedalDto, DesactivateMedalDto } from './dto/update-medal.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MedalBaseDto } from './dto';

@Controller('medals')
export class MedalsController {

  constructor(private readonly medalsService: MedalsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new medal' })
  @ApiResponse({
    status: 201,
    description: 'The medal has been successfully created.',
    type: MedalBaseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createMedalDto: CreateMedalDto) {
    return this.medalsService.create(createMedalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all medals' })
  @ApiResponse({
    status: 200,
    description: 'List of all medals',
    type: [MedalBaseDto],
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findAll() {
    return this.medalsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a medal by ID' })
  @ApiResponse({
    status: 200,
    description: 'The medal has been successfully retrieved.',
    type: MedalBaseDto,
  })
  @ApiResponse({ status: 404, description: 'Medal not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medalsService.findOne(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a medal' })
  @ApiResponse({
    status: 200,
    description: 'The medal has been successfully activated.',
    type: ActivateMedalDto,
  })
  @ApiResponse({ status: 404, description: 'Medal not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.medalsService.activate(id);
  }

  @Patch(':id/desactivate')
  @ApiOperation({ summary: 'Desactivate a medal' })
  @ApiResponse({
    status: 200,
    description: 'The medal has been successfully desactivated.',
    type: DesactivateMedalDto,
  })
  @ApiResponse({ status: 404, description: 'Medal not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  desactivate(@Param('id', ParseIntPipe) id: number) {
    return this.medalsService.desactivate(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a medal' })
  @ApiResponse({
    status: 200,
    description: 'The medal has been successfully deleted.',
    type: DesactivateMedalDto,
  })
  @ApiResponse({ status: 404, description: 'Medal not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.medalsService.remove(id);
  }
}
