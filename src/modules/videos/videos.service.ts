import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { PrismaService } from 'src/prisma.service';
import { VideoBaseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class VideosService {

  constructor(private prisma: PrismaService) { }

  async create(createVideoDto: CreateVideoDto): Promise<VideoBaseDto> {
    const data = await this.prisma.videos.create({
      data: {
        title: createVideoDto.title,
        url: createVideoDto.url,
        duration_seg: createVideoDto.duration_seg,
      },
      select: {
        id: true,
        title: true,
        url: true,
        duration_seg: true,
      }
    });

    const video: VideoBaseDto = {
      id: data.id,
      title: data.title,
      url: data.url,
      duration_seg: data.duration_seg,
      is_active: true,
    }

    return plainToInstance(VideoBaseDto, video)
  }

  async findAll() {
    const data = await this.prisma.videos.findMany({
      select: {
        id: true,
        title: true,
        url: true,
        duration_seg: true,
        is_active: true,
      }
    });

    const videos: VideoBaseDto[] = data.map(video => ({
      id: video.id,
      title: video.title,
      url: video.url,
      duration_seg: video.duration_seg,
      is_active: video.is_active,
    }));

    return plainToInstance(VideoBaseDto, videos);
  }

  async findOne(id: number) {
    const data = await this.prisma.videos.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        url: true,
        duration_seg: true,
        is_active: true,
      }
    });

    if (!data) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    return plainToInstance(VideoBaseDto, {
      id: data.id,
      title: data.title,
      url: data.url,
      duration_seg: data.duration_seg,
      is_active: data.is_active,
    });
  }

  async desactivate(id: number) {
    const existingVideo = await this.prisma.videos.findUnique({ where: { id } });
    if (!existingVideo) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    const data = await this.prisma.videos.update({
      where: { id },
      data: { is_active: false },
      select: {
        id: true,
        title: true,
        url: true,
        duration_seg: true,
        is_active: true,
      }
    });

    return plainToInstance(VideoBaseDto, {
      id: data.id,
      title: data.title,
      url: data.url,
      duration_seg: data.duration_seg,
      is_active: data.is_active,
    });
  }

  async activate(id: number) {
    const existingVideo = await this.prisma.videos.findUnique({ where: { id } });
    if (!existingVideo) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    const data = await this.prisma.videos.update({
      where: { id },
      data: { is_active: true },
      select: {
        id: true,
        title: true,
        url: true,
        duration_seg: true,
        is_active: true,
      }
    });

    return plainToInstance(VideoBaseDto, {
      id: data.id,
      title: data.title,
      url: data.url,
      duration_seg: data.duration_seg,
      is_active: data.is_active,
    });
  }

  async remove(id: number) {
    const existingVideo = await this.prisma.videos.findUnique({ where: { id } });
    if (!existingVideo) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    const data = await this.prisma.videos.delete({
      where: { id },
      select: {
        id: true,
        title: true,
        url: true,
        duration_seg: true,
        is_active: true,
      }
    });

    return plainToInstance(VideoBaseDto, {
      id: data.id,
      title: data.title,
      url: data.url,
      duration_seg: data.duration_seg,
      is_active: data.is_active,
    });
  }
}
