import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { PrismaService } from 'src/prisma.service';
import { DeviceBaseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async create(createDeviceDto: CreateDeviceDto): Promise<DeviceBaseDto> {
    const data = await this.prisma.devices.create({
      data: {
        name: createDeviceDto.name,
        consumption_kwh_h: createDeviceDto.consumption_kwh_h,
        url: createDeviceDto.url,
      },
      select: {
        id: true,
        name: true,
        consumption_kwh_h: true,
        url: true,
      },
    });

    const device: DeviceBaseDto = {
      id: data.id,
      name: data.name,
      consumption_kwh_h: data.consumption_kwh_h,
      url: data.url,
      is_active: true,
    };

    return plainToInstance(DeviceBaseDto, device);
  }

  async createArray(createDeviceDtos: CreateDeviceDto[]): Promise<DeviceBaseDto[]> {
    const devices: DeviceBaseDto[] = [];
    for (const dto of createDeviceDtos) {
      const data = await this.prisma.devices.create({
        data: {
          name: dto.name,
          consumption_kwh_h: dto.consumption_kwh_h,
          url: dto.url,
          is_active: dto.is_active ?? true,
        },
        select: {
          id: true,
          name: true,
          consumption_kwh_h: true,
          url: true,
          is_active: true,
        },
      });
      devices.push({
        id: data.id,
        name: data.name,
        consumption_kwh_h: data.consumption_kwh_h,
        url: data.url,
        is_active: data.is_active,
      });
    }
    return plainToInstance(DeviceBaseDto, devices);
  }

  async findAll() {
    const data = await this.prisma.devices.findMany({
      select: {
        id: true,
        name: true,
        consumption_kwh_h: true,
        url: true,
        is_active: true,
      },
    });

    const devices: DeviceBaseDto[] = data.map((device) => ({
      id: device.id,
      name: device.name,
      consumption_kwh_h: device.consumption_kwh_h,
      url: device.url,
      is_active: device.is_active,
    }));

    return plainToInstance(DeviceBaseDto, devices);
  }

  async findOne(id: string) {
    const data = await this.prisma.devices.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        consumption_kwh_h: true,
        url: true,
        is_active: true,
      },
    });

    if (!data) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    return plainToInstance(DeviceBaseDto, {
      id: data.id,
      name: data.name,
      consumption_kwh_h: data.consumption_kwh_h,
      url: data.url,
      is_active: data.is_active,
    });
  }

  async desactivate(id: string) {
    const existingDevice = await this.prisma.devices.findUnique({ where: { id } });
    if (!existingDevice) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    const data = await this.prisma.devices.update({
      where: { id },
      data: { is_active: false },
      select: {
        id: true,
        name: true,
        consumption_kwh_h: true,
        url: true,
        is_active: true,
      },
    });

    if (!data) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    return plainToInstance(DeviceBaseDto, {
      id: data.id,
      name: data.name,
      consumption_kwh_h: data.consumption_kwh_h,
      url: data.url,
      is_active: data.is_active,
    });
  }

  async activate(id: string) {
    const existingDevice = await this.prisma.devices.findUnique({ where: { id } });
    if (!existingDevice) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    const data = await this.prisma.devices.update({
      where: { id },
      data: { is_active: true },
      select: {
        id: true,
        name: true,
        consumption_kwh_h: true,
        url: true,
        is_active: true,
      },
    });

    return plainToInstance(DeviceBaseDto, {
      id: data.id,
      name: data.name,
      consumption_kwh_h: data.consumption_kwh_h,
      url: data.url,
      is_active: data.is_active,
    });
  }

  async remove(id: string) {
    const existingDevice = await this.prisma.devices.findUnique({ where: { id } });
    if (!existingDevice) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    const data = await this.prisma.devices.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        consumption_kwh_h: true,
        url: true,
        is_active: true,
      },
    });

    return plainToInstance(DeviceBaseDto, {
      id: data.id,
      name: data.name,
      consumption_kwh_h: data.consumption_kwh_h,
      url: data.url,
      is_active: data.is_active,
    });
  }
}
