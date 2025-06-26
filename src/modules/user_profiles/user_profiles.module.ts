import { Module } from '@nestjs/common';
import { UserProfilesService } from './user_profiles.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  exports: [UserProfilesService],
  providers: [UserProfilesService, PrismaService],
})
export class UserProfilesModule { }
