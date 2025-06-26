import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserMedalDto } from './dto/create-user-medal.dto';
import { PrismaService } from 'src/prisma.service';
import { UserMedalBaseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersMedalsService {

  constructor(private prisma: PrismaService) { }

  async create(createUserMedalDto: CreateUserMedalDto): Promise<UserMedalBaseDto> {
    // Verificar que el usuario existe
    const userExists = await this.prisma.users.findUnique({
      where: { id: createUserMedalDto.user_id }
    });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${createUserMedalDto.user_id} not found`);
    }

    // Verificar que la medalla existe
    const medalExists = await this.prisma.medals.findUnique({
      where: { id: createUserMedalDto.melda_id }
    });

    if (!medalExists) {
      throw new NotFoundException(`Medal with ID ${createUserMedalDto.melda_id} not found`);
    }

    // Verificar si ya existe la relación
    const existingRelation = await this.prisma.users_medals.findUnique({
      where: {
        user_id_melda_id: {
          user_id: createUserMedalDto.user_id,
          melda_id: createUserMedalDto.melda_id
        }
      },
      select: {
        user_id: true,
        melda_id: true,
        achievement_date: true,
        is_active: true,
      }
    });

    if (existingRelation) {
      // Si ya existe, retornar la relación existente

      return plainToInstance(UserMedalBaseDto, {
        user_id: existingRelation.user_id,
        melda_id: existingRelation.melda_id,
        achievement_date: existingRelation.achievement_date,
        is_active: existingRelation.is_active,
      });
    }

    // Crear nueva relación
    const data = await this.prisma.users_medals.create({
      data: {
        user_id: createUserMedalDto.user_id,
        melda_id: createUserMedalDto.melda_id,
        achievement_date: new Date(),
      },
      select: {
        user_id: true,
        melda_id: true,
        achievement_date: true,
        is_active: true,
      }
    });

    return plainToInstance(UserMedalBaseDto, {
      user_id: data.user_id,
      melda_id: data.melda_id,
      achievement_date: data.achievement_date,
      is_active: data.is_active,
    });
  }

  async findAll() {
    const data = await this.prisma.users_medals.findMany({
      select: {
        user_id: true,
        melda_id: true,
        achievement_date: true,
        is_active: true,
      },
      orderBy: {
        achievement_date: 'desc'
      }
    });

    const userMedals: UserMedalBaseDto[] = data.map(userMedal => ({
      user_id: userMedal.user_id,
      melda_id: userMedal.melda_id,
      achievement_date: userMedal.achievement_date,
      is_active: userMedal.is_active,
    }));

    return plainToInstance(UserMedalBaseDto, userMedals);
  }

  async findByUserId(user_id: string) {
    // Verificar que el usuario existe
    const userExists = await this.prisma.users.findUnique({
      where: { id: user_id }
    });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const data = await this.prisma.users_medals.findMany({
      where: { user_id },
      select: {
        user_id: true,
        melda_id: true,
        achievement_date: true,
        is_active: true,
      },
      orderBy: {
        achievement_date: 'desc'
      }
    });

    const userMedals: UserMedalBaseDto[] = data.map(userMedal => ({
      user_id: userMedal.user_id,
      melda_id: userMedal.melda_id,
      achievement_date: userMedal.achievement_date,
      is_active: userMedal.is_active,
    }));

    return plainToInstance(UserMedalBaseDto, userMedals);
  }

  async findByMedalId(melda_id: number) {
    // Verificar que la medalla existe
    const medalExists = await this.prisma.medals.findUnique({
      where: { id: melda_id }
    });

    if (!medalExists) {
      throw new NotFoundException(`Medal with ID ${melda_id} not found`);
    }

    const data = await this.prisma.users_medals.findMany({
      where: { melda_id },
      select: {
        user_id: true,
        melda_id: true,
        achievement_date: true,
        is_active: true,
      },
      orderBy: {
        achievement_date: 'desc'
      }
    });

    const userMedals: UserMedalBaseDto[] = data.map(userMedal => ({
      user_id: userMedal.user_id,
      melda_id: userMedal.melda_id,
      achievement_date: userMedal.achievement_date,
      is_active: userMedal.is_active,
    }));

    return plainToInstance(UserMedalBaseDto, userMedals);
  }

  async findOne(user_id: string, melda_id: number) {
    const data = await this.prisma.users_medals.findUnique({
      where: {
        user_id_melda_id: {
          user_id,
          melda_id
        }
      },
      select: {
        user_id: true,
        melda_id: true,
        achievement_date: true,
        is_active: true,
      }
    });

    if (!data) {
      throw new NotFoundException(`User-Medal relationship not found for user ${user_id} and medal ${melda_id}`);
    }

    return plainToInstance(UserMedalBaseDto, {
      user_id: data.user_id,
      melda_id: data.melda_id,
      achievement_date: data.achievement_date,
      is_active: data.is_active,
    });
  }

  async activate(user_id: string, melda_id: number) {
    const existingRelation = await this.prisma.users_medals.findUnique({
      where: {
        user_id_melda_id: {
          user_id,
          melda_id
        }
      }
    });

    if (!existingRelation) {
      throw new NotFoundException(`User-Medal relationship not found for user ${user_id} and medal ${melda_id}`);
    }

    const data = await this.prisma.users_medals.update({
      where: {
        user_id_melda_id: {
          user_id,
          melda_id
        }
      },
      data: { is_active: true },
      select: {
        user_id: true,
        melda_id: true,
        achievement_date: true,
        is_active: true,
      }
    });

    return plainToInstance(UserMedalBaseDto, {
      user_id: data.user_id,
      melda_id: data.melda_id,
      achievement_date: data.achievement_date,
      is_active: data.is_active,
    });
  }

  async desactivate(user_id: string, melda_id: number) {
    const existingRelation = await this.prisma.users_medals.findUnique({
      where: {
        user_id_melda_id: {
          user_id,
          melda_id
        }
      }
    });

    if (!existingRelation) {
      throw new NotFoundException(`User-Medal relationship not found for user ${user_id} and medal ${melda_id}`);
    }

    const data = await this.prisma.users_medals.update({
      where: {
        user_id_melda_id: {
          user_id,
          melda_id
        }
      },
      data: { is_active: false },
      select: {
        user_id: true,
        melda_id: true,
        achievement_date: true,
        is_active: true,
      }
    });

    return plainToInstance(UserMedalBaseDto, {
      user_id: data.user_id,
      melda_id: data.melda_id,
      achievement_date: data.achievement_date,
      is_active: data.is_active,
    });
  }

  async remove(user_id: string, melda_id: number) {
    const existingRelation = await this.prisma.users_medals.findUnique({
      where: {
        user_id_melda_id: {
          user_id,
          melda_id
        }
      }
    });

    if (!existingRelation) {
      throw new NotFoundException(`User-Medal relationship not found for user ${user_id} and medal ${melda_id}`);
    }

    const data = await this.prisma.users_medals.delete({
      where: {
        user_id_melda_id: {
          user_id,
          melda_id
        }
      },
      select: {
        user_id: true,
        melda_id: true,
        achievement_date: true,
        is_active: true,
      }
    });

    return plainToInstance(UserMedalBaseDto, {
      user_id: data.user_id,
      melda_id: data.melda_id,
      achievement_date: data.achievement_date,
      is_active: data.is_active,
    });
  }
}
