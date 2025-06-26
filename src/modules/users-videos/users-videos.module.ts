import { Module } from '@nestjs/common';
import { UsersVideosService } from './users-videos.service';
import { UsersVideosController } from './users-videos.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [UsersVideosController],
  providers: [UsersVideosService, PrismaService],
})
export class UsersVideosModule { }
