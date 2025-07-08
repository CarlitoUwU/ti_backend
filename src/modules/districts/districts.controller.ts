import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { ActivateDistrictDto, DesactivateDistrictDto } from './dto/update-district.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DistrictBaseDto } from './dto';

@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new district' })
  @ApiResponse({
    status: 201,
    description: 'The district has been successfully created.',
    type: DistrictBaseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtsService.create(createDistrictDto);
  }

  @Post('array')
  @ApiOperation({ summary: 'Create multiple districts' })
  @ApiResponse({
    status: 201,
    description: 'The districts have been successfully created.',
    type: [DistrictBaseDto],
  })
  createArray(@Body() createDistrictDtos: CreateDistrictDto[]) {
    return this.districtsService.createArray(createDistrictDtos);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all districts' })
  @ApiResponse({
    status: 200,
    description: 'List of all districts',
    type: [DistrictBaseDto],
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findAll() {
    return this.districtsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a district by ID' })
  @ApiResponse({
    status: 200,
    description: 'The district has been successfully retrieved.',
    type: DistrictBaseDto,
  })
  @ApiResponse({ status: 404, description: 'District not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.districtsService.findOne(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a district' })
  @ApiResponse({
    status: 200,
    description: 'The district has been successfully activated.',
    type: ActivateDistrictDto,
  })
  @ApiResponse({ status: 404, description: 'District not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.districtsService.activate(id);
  }

  @Patch(':id/desactivate')
  @ApiOperation({ summary: 'Desactivate a district' })
  @ApiResponse({
    status: 200,
    description: 'The district has been successfully desactivated.',
    type: DesactivateDistrictDto,
  })
  @ApiResponse({ status: 404, description: 'District not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  desactivate(@Param('id', ParseIntPipe) id: number) {
    return this.districtsService.desactivate(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a district' })
  @ApiResponse({
    status: 200,
    description: 'The district has been successfully deleted.',
    type: DesactivateDistrictDto,
  })
  @ApiResponse({ status: 404, description: 'District not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.districtsService.remove(id);
  }
}
