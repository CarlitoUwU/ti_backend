import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedalDto } from './dto/create-medal.dto';
import { PrismaService } from 'src/prisma.service';
import { MedalBaseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MedalsService {
  constructor(private prisma: PrismaService) {}

  async create(createMedalDto: CreateMedalDto): Promise<MedalBaseDto> {
    const data = await this.prisma.medals.create({
      data: {
        name: createMedalDto.name,
        description: createMedalDto.description,
        url_img: createMedalDto.url_img,
      },
      select: {
        id: true,
        name: true,
        description: true,
        url_img: true,
      },
    });

    const medal: MedalBaseDto = {
      id: data.id,
      name: data.name,
      description: data.description,
      url_img: data.url_img,
      is_active: true,
    };

    return plainToInstance(MedalBaseDto, medal);
  }

  async findAll() {
    const data = await this.prisma.medals.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        url_img: true,
        is_active: true,
      },
    });

    const medals: MedalBaseDto[] = data.map((medal) => ({
      id: medal.id,
      name: medal.name,
      description: medal.description,
      url_img: medal.url_img,
      is_active: medal.is_active,
    }));

    return plainToInstance(MedalBaseDto, medals);
  }

  async findOne(id: number) {
    const data = await this.prisma.medals.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        url_img: true,
        is_active: true,
      },
    });

    if (!data) {
      throw new NotFoundException(`Medal with ID ${id} not found`);
    }

    return plainToInstance(MedalBaseDto, {
      id: data.id,
      name: data.name,
      description: data.description,
      url_img: data.url_img,
      is_active: data.is_active,
    });
  }

  async desactivate(id: number) {
    const existingMedal = await this.prisma.medals.findUnique({ where: { id } });
    if (!existingMedal) {
      throw new NotFoundException(`Medal with ID ${id} not found`);
    }

    const data = await this.prisma.medals.update({
      where: { id },
      data: { is_active: false },
      select: {
        id: true,
        name: true,
        description: true,
        url_img: true,
        is_active: true,
      },
    });

    return plainToInstance(MedalBaseDto, {
      id: data.id,
      name: data.name,
      description: data.description,
      url_img: data.url_img,
      is_active: data.is_active,
    });
  }

  async activate(id: number) {
    const existingMedal = await this.prisma.medals.findUnique({ where: { id } });
    if (!existingMedal) {
      throw new NotFoundException(`Medal with ID ${id} not found`);
    }

    const data = await this.prisma.medals.update({
      where: { id },
      data: { is_active: true },
      select: {
        id: true,
        name: true,
        description: true,
        url_img: true,
        is_active: true,
      },
    });

    return plainToInstance(MedalBaseDto, {
      id: data.id,
      name: data.name,
      description: data.description,
      url_img: data.url_img,
      is_active: data.is_active,
    });
  }

  async remove(id: number) {
    const existingMedal = await this.prisma.medals.findUnique({ where: { id } });
    if (!existingMedal) {
      throw new NotFoundException(`Medal with ID ${id} not found`);
    }

    const data = await this.prisma.medals.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        url_img: true,
        is_active: true,
      },
    });

    return plainToInstance(MedalBaseDto, {
      id: data.id,
      name: data.name,
      description: data.description,
      url_img: data.url_img,
      is_active: data.is_active,
    });
  }
}
