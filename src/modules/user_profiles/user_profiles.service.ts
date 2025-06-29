import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserProfileDto } from './dto/create-user_profile.dto';
import { UserProfileBaseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserProfilesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(id: string, createUserProfileDto: CreateUserProfileDto) {
    const data = await this.prismaService.user_profiles.create({
      data: {
        user_id: id,
        first_name: createUserProfileDto.first_name,
        last_name: createUserProfileDto.last_name,
        tastes: createUserProfileDto.tastes,
        streak: 0,
        is_active: createUserProfileDto.is_active,
      },
    });

    return plainToInstance(UserProfileBaseDto, {
      user_id: data.user_id,
      first_name: data.first_name,
      last_name: data.last_name,
      tastes: data.tastes,
      streak: data.streak,
      is_active: data.is_active,
    });
  }

  async findOne(id: string) {
    const data = await this.prismaService.user_profiles.findUnique({
      where: { user_id: id },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        tastes: true,
        streak: true,
        is_active: true,
      },
    });

    if (!data) {
      return null;
    }

    return plainToInstance(UserProfileBaseDto, {
      user_id: data.user_id,
      first_name: data.first_name,
      last_name: data.last_name,
      tastes: data.tastes,
      streak: data.streak,
      is_active: data.is_active,
    });
  }

  async activate(id: string) {
    const data = await this.prismaService.user_profiles.update({
      where: { user_id: id },
      data: { is_active: true },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        tastes: true,
        streak: true,
        is_active: true,
      },
    });

    if (!data) {
      return null;
    }
    return plainToInstance(UserProfileBaseDto, {
      user_id: data.user_id,
      first_name: data.first_name,
      last_name: data.last_name,
      tastes: data.tastes,
      streak: data.streak,
      is_active: data.is_active,
    });
  }

  async desactivate(id: string) {
    const data = await this.prismaService.user_profiles.update({
      where: { user_id: id },
      data: { is_active: false },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        tastes: true,
        streak: true,
        is_active: true,
      },
    });

    if (!data) {
      return null;
    }
    return plainToInstance(UserProfileBaseDto, {
      user_id: data.user_id,
      first_name: data.first_name,
      last_name: data.last_name,
      tastes: data.tastes,
      streak: data.streak,
      is_active: data.is_active,
    });
  }

  async remove(id: string) {
    const data = await this.prismaService.user_profiles.delete({
      where: { user_id: id },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        tastes: true,
        streak: true,
        is_active: true,
      },
    });

    return plainToInstance(UserProfileBaseDto, {
      user_id: data.user_id,
      first_name: data.first_name,
      last_name: data.last_name,
      tastes: data.tastes,
      streak: data.streak,
      is_active: data.is_active,
    });
  }
}
