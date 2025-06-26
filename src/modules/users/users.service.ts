import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import { UserProfilesService } from '../user_profiles/user_profiles.service';
import { UserBaseDto } from './dto';

@Injectable()
export class UsersService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userProfilesService: UserProfilesService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prismaService.users.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        password: createUserDto.password,
        district_id: createUserDto.district_id,
        is_active: createUserDto.is_active,
        created_at: new Date(),
        updated_at: new Date(),
        last_login: new Date(),
      },
    });

    const userProfile = await this.userProfilesService.create(user.id, {
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      tastes: createUserDto.taste,
      is_active: createUserDto.is_active ?? true,
    });

    const district = await this.prismaService.districts.findUnique({
      where: { id: createUserDto.district_id },
      select: {
        id: true,
        name: true,
        fee_kwh: true,
        is_active: true,
      }
    });

    return this.toUserDto({
      ...user,
      user_profiles: { ...userProfile },
      districts: { ...district },
    });
  }

  async findAll() {
    const users = await this.prismaService.users.findMany({
      include: {
        user_profiles: true,
        districts: true,
      },
    });

    if (!users || users.length === 0) {
      return [];
    }

    return users.map(user => this.toUserDto(user));
  }

  async findOne(id: string) {
    const user = await this.prismaService.users.findUnique({
      where: { id },
      include: {
        user_profiles: true,
        districts: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }

    return this.toUserDto(user);
  }

  async desactivate(id: string) {
    const existingUser = await this.prismaService.users.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }
    const user = await this.prismaService.users.update({
      where: { id },
      data: {
        is_active: false,
        updated_at: new Date(),
      },
      include: {
        user_profiles: true,
        districts: true,
      },
    });

    return this.toUserDto(user);
  }

  async activate(id: string) {
    const existingUser = await this.prismaService.users.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }

    const user = await this.prismaService.users.update({
      where: { id },
      data: {
        is_active: true,
        updated_at: new Date(),
      },
      include: {
        user_profiles: true,
        districts: true,
      },
    });

    return this.toUserDto(user);
  }

  async remove(id: string) {
    const existingUser = await this.prismaService.users.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }

    const user = await this.prismaService.users.delete({
      where: { id },
      include: {
        user_profiles: true,
      },
    });

    return this.toUserDto(user);
  }

  private toUserDto(data: any): UserBaseDto {
    console.log('Converting user data to UserBaseDto:', data);
    return {
      id: data.id,
      email: data.email,
      username: data.username,
      is_active: data.is_active,
      user_profile: {
        first_name: data.user_profiles.first_name,
        last_name: data.user_profiles.last_name,
        tastes: data.user_profiles.tastes,
      },
      district: {
        id: data.districts.id,
        name: data.districts.name,
        fee_kwh: data.districts.fee_kwh,
        is_active: data.districts.is_active,
      },
    };

  }
}
