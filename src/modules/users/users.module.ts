import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { UserProfilesService } from '../user_profiles/user_profiles.service';
import { MailsModule } from '../mails/mails.module';

@Module({
  imports: [MailsModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, UserProfilesService, PrismaService],
})
export class UsersModule {}
