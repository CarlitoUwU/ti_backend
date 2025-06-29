import { Module } from '@nestjs/common';
import { UsersVideosService } from './users-videos.service';
import { UsersVideosController } from './users-videos.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersMedalsService } from '../users-medals/users-medals.service';

@Module({
  controllers: [UsersVideosController],
  providers: [UsersVideosService, PrismaService, UsersMedalsService],
})
export class UsersVideosModule {}
