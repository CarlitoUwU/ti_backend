import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { ActivateVideoDto, DesactivateVideoDto } from './dto/update-video.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VideoBaseDto } from './dto';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new video' })
  @ApiResponse({
    status: 201,
    description: 'The video has been successfully created.',
    type: VideoBaseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videosService.create(createVideoDto);
  }

  @Post('array')
  @ApiOperation({ summary: 'Create multiple videos' })
  @ApiResponse({
    status: 201,
    description: 'The videos have been successfully created.',
    type: [VideoBaseDto],
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  createArray(@Body() createVideoDtos: CreateVideoDto[]) {
    return this.videosService.createArray(createVideoDtos);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all videos' })
  @ApiResponse({
    status: 200,
    description: 'List of all videos',
    type: [VideoBaseDto],
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findAll() {
    return this.videosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a video by ID' })
  @ApiResponse({
    status: 200,
    description: 'The video has been successfully retrieved.',
    type: VideoBaseDto,
  })
  @ApiResponse({ status: 404, description: 'Video not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.findOne(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a video' })
  @ApiResponse({
    status: 200,
    description: 'The video has been successfully activated.',
    type: ActivateVideoDto,
  })
  @ApiResponse({ status: 404, description: 'Video not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.activate(id);
  }

  @Patch(':id/desactivate')
  @ApiOperation({ summary: 'Desactivate a video' })
  @ApiResponse({
    status: 200,
    description: 'The video has been successfully desactivated.',
    type: DesactivateVideoDto,
  })
  @ApiResponse({ status: 404, description: 'Video not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  desactivate(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.desactivate(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a video' })
  @ApiResponse({
    status: 200,
    description: 'The video has been successfully deleted.',
    type: DesactivateVideoDto,
  })
  @ApiResponse({ status: 404, description: 'Video not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.remove(id);
  }
}
