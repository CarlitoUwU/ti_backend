import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserVideoDto } from './dto/create-user-video.dto';
import { PrismaService } from 'src/prisma.service';
import { UserVideoBaseDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { UsersMedalsService } from '../users-medals/users-medals.service';
import { DateService } from '../../common/services/date.service';

@Injectable()
export class UsersVideosService {

  private id_medal_bronce: number = 1;
  private id_medal_plata: number = 2;
  private id_medal_oro: number = 3;

  constructor(
    private prisma: PrismaService,
    private usersMedalsService: UsersMedalsService,
    private dateService: DateService,
  ) { }

  async create(createUserVideoDto: CreateUserVideoDto): Promise<UserVideoBaseDto> {
    // Verificar que el usuario existe
    const userExists = await this.prisma.users.findUnique({
      where: { id: createUserVideoDto.user_id }
    });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${createUserVideoDto.user_id} not found`);
    }

    // Verificar que el video existe
    const videoExists = await this.prisma.videos.findUnique({
      where: { id: createUserVideoDto.video_id }
    });

    if (!videoExists) {
      throw new NotFoundException(`Video with ID ${createUserVideoDto.video_id} not found`);
    }

    // Verificar si ya existe la relación
    const existingRelation = await this.prisma.users_videos.findUnique({
      where: {
        user_id_video_id: {
          user_id: createUserVideoDto.user_id,
          video_id: createUserVideoDto.video_id
        }
      },
      select: {
        user_id: true,
        video_id: true,
        date_seen: true,
        is_active: true,
      }
    });

    if (existingRelation) {
      return plainToInstance(UserVideoBaseDto, {
        user_id: existingRelation.user_id,
        video_id: existingRelation.video_id,
        date_seen: existingRelation.date_seen,
        is_active: existingRelation.is_active,
      });
    }

    // Crear nueva relación
    const data = await this.prisma.users_videos.create({
      data: {
        user_id: createUserVideoDto.user_id,
        video_id: createUserVideoDto.video_id,
        date_seen: this.dateService.getCurrentPeruDate(),
      },
      select: {
        user_id: true,
        video_id: true,
        date_seen: true,
        is_active: true,
      }
    });

    // Asignar medallas si corresponde
    const count = await this.countByUserId(createUserVideoDto.user_id);
    if (count === 1) {
      await this.usersMedalsService.create({
        user_id: createUserVideoDto.user_id,
        melda_id: this.id_medal_bronce
      });
    } else if (count === 10) {
      await this.usersMedalsService.create({
        user_id: createUserVideoDto.user_id,
        melda_id: this.id_medal_plata
      });
    } else if (count === 25) {
      await this.usersMedalsService.create({
        user_id: createUserVideoDto.user_id,
        melda_id: this.id_medal_oro
      });
    }

    return plainToInstance(UserVideoBaseDto, {
      user_id: data.user_id,
      video_id: data.video_id,
      date_seen: data.date_seen,
      is_active: data.is_active,
    });
  }

  async findAll() {
    const data = await this.prisma.users_videos.findMany({
      select: {
        user_id: true,
        video_id: true,
        date_seen: true,
        is_active: true,
      },
      orderBy: {
        date_seen: 'desc'
      }
    });

    const userVideos: UserVideoBaseDto[] = data.map(userVideo => ({
      user_id: userVideo.user_id,
      video_id: userVideo.video_id,
      date_seen: userVideo.date_seen,
      is_active: userVideo.is_active,
    }));

    return plainToInstance(UserVideoBaseDto, userVideos);
  }

  async findByUserId(user_id: string) {
    // Verificar que el usuario existe
    const userExists = await this.prisma.users.findUnique({
      where: { id: user_id }
    });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const data = await this.prisma.users_videos.findMany({
      where: { user_id },
      select: {
        user_id: true,
        video_id: true,
        date_seen: true,
        is_active: true,
      },
      orderBy: {
        date_seen: 'desc'
      }
    });

    const userVideos: UserVideoBaseDto[] = data.map(userVideo => ({
      user_id: userVideo.user_id,
      video_id: userVideo.video_id,
      date_seen: userVideo.date_seen,
      is_active: userVideo.is_active,
    }));

    return plainToInstance(UserVideoBaseDto, userVideos);
  }

  async findByVideoId(video_id: number) {
    // Verificar que el video existe
    const videoExists = await this.prisma.videos.findUnique({
      where: { id: video_id }
    });

    if (!videoExists) {
      throw new NotFoundException(`Video with ID ${video_id} not found`);
    }

    const data = await this.prisma.users_videos.findMany({
      where: { video_id },
      select: {
        user_id: true,
        video_id: true,
        date_seen: true,
        is_active: true,
      },
      orderBy: {
        date_seen: 'desc'
      }
    });

    const userVideos: UserVideoBaseDto[] = data.map(userVideo => ({
      user_id: userVideo.user_id,
      video_id: userVideo.video_id,
      date_seen: userVideo.date_seen,
      is_active: userVideo.is_active,
    }));

    return plainToInstance(UserVideoBaseDto, userVideos);
  }

  async findOne(user_id: string, video_id: number) {
    const data = await this.prisma.users_videos.findUnique({
      where: {
        user_id_video_id: {
          user_id,
          video_id
        }
      },
      select: {
        user_id: true,
        video_id: true,
        date_seen: true,
        is_active: true,
      }
    });

    if (!data) {
      throw new NotFoundException(`User-Video relationship not found for user ${user_id} and video ${video_id}`);
    }

    return plainToInstance(UserVideoBaseDto, {
      user_id: data.user_id,
      video_id: data.video_id,
      date_seen: data.date_seen,
      is_active: data.is_active,
    });
  }

  async activate(user_id: string, video_id: number) {
    const existingRelation = await this.prisma.users_videos.findUnique({
      where: {
        user_id_video_id: {
          user_id,
          video_id
        }
      }
    });

    if (!existingRelation) {
      throw new NotFoundException(`User-Video relationship not found for user ${user_id} and video ${video_id}`);
    }

    const data = await this.prisma.users_videos.update({
      where: {
        user_id_video_id: {
          user_id,
          video_id
        }
      },
      data: { is_active: true },
      select: {
        user_id: true,
        video_id: true,
        date_seen: true,
        is_active: true,
      }
    });

    return plainToInstance(UserVideoBaseDto, {
      user_id: data.user_id,
      video_id: data.video_id,
      date_seen: data.date_seen,
      is_active: data.is_active,
    });
  }

  async desactivate(user_id: string, video_id: number) {
    const existingRelation = await this.prisma.users_videos.findUnique({
      where: {
        user_id_video_id: {
          user_id,
          video_id
        }
      }
    });

    if (!existingRelation) {
      throw new NotFoundException(`User-Video relationship not found for user ${user_id} and video ${video_id}`);
    }

    const data = await this.prisma.users_videos.update({
      where: {
        user_id_video_id: {
          user_id,
          video_id
        }
      },
      data: { is_active: false },
      select: {
        user_id: true,
        video_id: true,
        date_seen: true,
        is_active: true,
      }
    });

    return plainToInstance(UserVideoBaseDto, {
      user_id: data.user_id,
      video_id: data.video_id,
      date_seen: data.date_seen,
      is_active: data.is_active,
    });
  }

  async remove(user_id: string, video_id: number) {
    const existingRelation = await this.prisma.users_videos.findUnique({
      where: {
        user_id_video_id: {
          user_id,
          video_id
        }
      }
    });

    if (!existingRelation) {
      throw new NotFoundException(`User-Video relationship not found for user ${user_id} and video ${video_id}`);
    }

    const data = await this.prisma.users_videos.delete({
      where: {
        user_id_video_id: {
          user_id,
          video_id
        }
      },
      select: {
        user_id: true,
        video_id: true,
        date_seen: true,
        is_active: true,
      }
    });

    return plainToInstance(UserVideoBaseDto, {
      user_id: data.user_id,
      video_id: data.video_id,
      date_seen: data.date_seen,
      is_active: data.is_active,
    });
  }

  async countByUserId(user_id: string): Promise<number> {
    // Verificar que el usuario existe
    const userExists = await this.prisma.users.findUnique({
      where: { id: user_id }
    });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const count = await this.prisma.users_videos.count({
      where: { user_id, is_active: true }
    });

    return count;
  }
}
