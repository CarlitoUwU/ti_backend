import { Module } from '@nestjs/common';
import { MedalsService } from './medals.service';
import { MedalsController } from './medals.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MedalsController],
  providers: [MedalsService, PrismaService],
})
export class MedalsModule {}
