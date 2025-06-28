import { Module } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';
import { PrismaService } from '../../prisma.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [SavingsController],
  providers: [SavingsService, PrismaService],
  exports: [SavingsService],
})
export class SavingsModule { }
