import { Module } from '@nestjs/common';
import { UsersMedalsService } from './users-medals.service';
import { UsersMedalsController } from './users-medals.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  exports: [UsersMedalsService],
  controllers: [UsersMedalsController],
  providers: [UsersMedalsService, PrismaService],
})
export class UsersMedalsModule { }
