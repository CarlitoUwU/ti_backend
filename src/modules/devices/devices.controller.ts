import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { ActivateDeviceDto, DesactivateDeviceDto } from './dto/update-device.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeviceBaseDto } from './dto';

@Controller('devices')
export class DevicesController {

  constructor(private readonly devicesService: DevicesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new device' })
  @ApiResponse({
    status: 201,
    description: 'The device has been successfully created.',
    type: DeviceBaseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all devices' })
  @ApiResponse({
    status: 200,
    description: 'List of all devices',
    type: [DeviceBaseDto],
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findAll() {
    return this.devicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a device by ID' })
  @ApiResponse({
    status: 200,
    description: 'The device has been successfully retrieved.',
    type: DeviceBaseDto,
  })
  @ApiResponse({ status: 404, description: 'Device not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.devicesService.findOne(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a device' })
  @ApiResponse({
    status: 200,
    description: 'The device has been successfully activated.',
    type: ActivateDeviceDto,
  })
  @ApiResponse({ status: 404, description: 'Device not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.devicesService.activate(id);
  }

  @Patch(':id/desactivate')
  @ApiOperation({ summary: 'Desactivate a device' })
  @ApiResponse({
    status: 200,
    description: 'The device has been successfully desactivated.',
    type: DesactivateDeviceDto,
  })
  @ApiResponse({ status: 404, description: 'Device not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  desactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.devicesService.desactivate(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a device' })
  @ApiResponse({
    status: 200,
    description: 'The device has been successfully deleted.',
    type: DesactivateDeviceDto,
  })
  @ApiResponse({ status: 404, description: 'Device not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.devicesService.remove(id);
  }
}
