import { Injectable } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { PrismaService } from 'src/prisma.service';
import { DistrictBaseDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { UpdateDistrictDto } from './dto/update-district.dto';

@Injectable()
export class DistrictsService {
  constructor(private prisma: PrismaService) {}

  async create(createDistrictDto: CreateDistrictDto): Promise<DistrictBaseDto> {
    const data = await this.prisma.districts.create({
      data: {
        name: createDistrictDto.name,
        fee_kwh: createDistrictDto.fee_kwh,
      },
      select: {
        id: true,
        name: true,
        fee_kwh: true,
      },
    });

    const district: DistrictBaseDto = {
      id: data.id,
      name: data.name,
      fee_kwh: data.fee_kwh,
      is_active: true,
    };

    return plainToInstance(DistrictBaseDto, district);
  }

  async createArray(createDistrictDtos: CreateDistrictDto[]): Promise<DistrictBaseDto[]> {
    const districts: DistrictBaseDto[] = [];
    for (const dto of createDistrictDtos) {
      const data = await this.prisma.districts.create({
        data: {
          name: dto.name,
          fee_kwh: dto.fee_kwh,
          is_active: dto.is_active ?? true,
        },
        select: {
          id: true,
          name: true,
          fee_kwh: true,
          is_active: true,
        },
      });
      districts.push({
        id: data.id,
        name: data.name,
        fee_kwh: data.fee_kwh,
        is_active: data.is_active,
      });
    }
    return plainToInstance(DistrictBaseDto, districts);
  }

  async findAll() {
    const data = await this.prisma.districts.findMany({
      select: {
        id: true,
        name: true,
        fee_kwh: true,
        is_active: true,
      },
    });

    const districts: DistrictBaseDto[] = data.map((district) => ({
      id: district.id,
      name: district.name,
      fee_kwh: district.fee_kwh,
      is_active: district.is_active,
    }));

    return plainToInstance(DistrictBaseDto, districts);
  }

  async findOne(id: number) {
    const data = await this.prisma.districts.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        fee_kwh: true,
        is_active: true,
      },
    });

    if (!data) {
      throw new Error(`District with ID ${id} not found`);
    }

    return plainToInstance(DistrictBaseDto, {
      id: data.id,
      name: data.name,
      fee_kwh: data.fee_kwh,
      is_active: data.is_active,
    });
  }

  async update(id: number, updateDistrictDto: UpdateDistrictDto) {
    const existing = await this.findOne(id);

    if (!existing) {
      throw new Error(`District with ID ${id} not found`);
    }

    const data = await this.prisma.districts.update({
      where: { id },
      data: {
        name: updateDistrictDto.name ?? existing.name,
        fee_kwh: updateDistrictDto.fee_kwh ?? existing.fee_kwh,
      },
      select: {
        id: true,
        name: true,
        fee_kwh: true,
        is_active: true,
      },
    });

    if (!data) {
      throw new Error(`District with ID ${id} not found`);
    }

    return plainToInstance(DistrictBaseDto, {
      id: data.id,
      name: data.name,
      fee_kwh: data.fee_kwh,
      is_active: data.is_active,
    });
  }

  async desactivate(id: number) {
    const data = await this.prisma.districts.update({
      where: { id },
      data: { is_active: false },
      select: {
        id: true,
        name: true,
        fee_kwh: true,
        is_active: true,
      },
    });

    if (!data) {
      throw new Error(`District with ID ${id} not found`);
    }

    return plainToInstance(DistrictBaseDto, {
      id: data.id,
      name: data.name,
      fee_kwh: data.fee_kwh,
      is_active: data.is_active,
    });
  }

  async activate(id: number) {
    const data = await this.prisma.districts.update({
      where: { id },
      data: { is_active: true },
      select: {
        id: true,
        name: true,
        fee_kwh: true,
        is_active: true,
      },
    });

    if (!data) {
      throw new Error(`District with ID ${id} not found`);
    }

    return plainToInstance(DistrictBaseDto, {
      id: data.id,
      name: data.name,
      fee_kwh: data.fee_kwh,
      is_active: data.is_active,
    });
  }

  async remove(id: number) {
    const data = await this.prisma.districts.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        fee_kwh: true,
        is_active: true,
      },
    });

    if (!data) {
      throw new Error(`District with ID ${id} not found`);
    }

    return plainToInstance(DistrictBaseDto, {
      id: data.id,
      name: data.name,
      fee_kwh: data.fee_kwh,
      is_active: data.is_active,
    });
  }
}
