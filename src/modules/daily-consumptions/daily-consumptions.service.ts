import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateDailyConsumptionDto } from './dto/create-daily-consumption.dto';
import { UpdateDailyConsumptionDto } from './dto/update-daily-consumption.dto';
import { DailyConsumptionDto } from './dto/daily-consumption.dto';
import { plainToInstance } from 'class-transformer';
import { DateService } from '../../common/services/date.service';

@Injectable()
export class DailyConsumptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dateService: DateService,
  ) { }

  async create(createDailyConsumptionDto: CreateDailyConsumptionDto): Promise<DailyConsumptionDto> {
    const user = await this.prisma.users.findUnique({
      where: { id: createDailyConsumptionDto.user_id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${createDailyConsumptionDto.user_id} not found`);
    }

    const device = await this.prisma.devices.findUnique({
      where: { id: createDailyConsumptionDto.device_id },
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${createDailyConsumptionDto.device_id} not found`);
    }

    // Obtener la fecha actual de Perú (solo fecha, sin hora)
    const dateOnly = this.dateService.getCurrentPeruDateOnly();

    // Validar duplicados por user, device y fecha
    const existingRecord = await this.prisma.daily_consumptions.findFirst({
      where: {
        user_id: createDailyConsumptionDto.user_id,
        device_id: createDailyConsumptionDto.device_id,
        date: dateOnly,
      },
    });

    if (existingRecord) {
      throw new ConflictException(
        `A daily consumption record already exists for user ${createDailyConsumptionDto.user_id}, device ${createDailyConsumptionDto.device_id}, and date ${this.dateService.formatDateToString(dateOnly)}`
      );
    }

    // Si es el primer registro del usuario en ese día, puedes actualizar streak
    const userDailyConsumptions = await this.prisma.daily_consumptions.count({
      where: {
        user_id: createDailyConsumptionDto.user_id,
        date: dateOnly,
      },
    });

    if (userDailyConsumptions === 0) {
      await this.prisma.user_profiles.update({
        where: { user_id: createDailyConsumptionDto.user_id },
        data: {
          streak: {
            increment: 1,
          },
        },
      });
    }

    const estimated_consumption = createDailyConsumptionDto.hours_use * device.consumption_kwh_h;

    const dailyConsumption = await this.prisma.daily_consumptions.create({
      data: {
        user_id: createDailyConsumptionDto.user_id,
        device_id: createDailyConsumptionDto.device_id,
        date: dateOnly,
        hours_use: createDailyConsumptionDto.hours_use,
        estimated_consumption,
        is_active: createDailyConsumptionDto.is_active ?? true,
      },
    });

    return plainToInstance(DailyConsumptionDto, {
      id: dailyConsumption.id,
      user_id: dailyConsumption.user_id,
      device_id: dailyConsumption.device_id,
      date: dailyConsumption.date.toISOString().split('T')[0],
      hours_use: dailyConsumption.hours_use,
      estimated_consumption: dailyConsumption.estimated_consumption,
      is_active: dailyConsumption.is_active,
    });
  }

  async findAll(): Promise<DailyConsumptionDto[]> {
    const dailyConsumptions = await this.prisma.daily_consumptions.findMany({
      where: { is_active: true },
      orderBy: { date: 'desc' },
    });

    return dailyConsumptions.map(dc => ({
      ...dc,
      date: dc.date.toISOString().split('T')[0],
    })) as DailyConsumptionDto[];
  }

  async findOne(id: string): Promise<DailyConsumptionDto> {
    const dailyConsumption = await this.prisma.daily_consumptions.findUnique({
      where: { id },
    });

    if (!dailyConsumption) {
      throw new NotFoundException(`Daily consumption with ID ${id} not found`);
    }

    return plainToInstance(DailyConsumptionDto, {
      id: dailyConsumption.id,
      user_id: dailyConsumption.user_id,
      device_id: dailyConsumption.device_id,
      date: dailyConsumption.date.toISOString().split('T')[0],
      hours_use: dailyConsumption.hours_use,
      estimated_consumption: dailyConsumption.estimated_consumption,
      is_active: dailyConsumption.is_active,
    });
  }

  async findByUser(userId: string): Promise<DailyConsumptionDto[]> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const dailyConsumptions = await this.prisma.daily_consumptions.findMany({
      where: {
        user_id: userId,
        is_active: true
      },
      orderBy: { date: 'desc' },
    });

    return dailyConsumptions.map(dc => plainToInstance(DailyConsumptionDto, {
      id: dc.id,
      user_id: dc.user_id,
      device_id: dc.device_id,
      date: dc.date.toISOString().split('T')[0],
      hours_use: dc.hours_use,
      estimated_consumption: dc.estimated_consumption,
      is_active: dc.is_active,
    }));
  }

  async findByDevice(deviceId: string): Promise<DailyConsumptionDto[]> {
    const device = await this.prisma.devices.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${deviceId} not found`);
    }

    const dailyConsumptions = await this.prisma.daily_consumptions.findMany({
      where: {
        device_id: deviceId,
        is_active: true
      },
      orderBy: { date: 'desc' },
    });

    return dailyConsumptions.map(dc => plainToInstance(DailyConsumptionDto, {
      id: dc.id,
      user_id: dc.user_id,
      device_id: dc.device_id,
      date: dc.date.toISOString().split('T')[0],
      hours_use: dc.hours_use,
      estimated_consumption: dc.estimated_consumption,
      is_active: dc.is_active,
    }));
  }

  async findByUserAndDevice(userId: string, deviceId: string): Promise<DailyConsumptionDto[]> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const device = await this.prisma.devices.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${deviceId} not found`);
    }

    const dailyConsumptions = await this.prisma.daily_consumptions.findMany({
      where: {
        user_id: userId,
        device_id: deviceId,
        is_active: true
      },
      orderBy: { date: 'desc' },
    });

    return dailyConsumptions.map(dc => plainToInstance(DailyConsumptionDto, {
      id: dc.id,
      user_id: dc.user_id,
      device_id: dc.device_id,
      date: dc.date.toISOString().split('T')[0],
      hours_use: dc.hours_use,
      estimated_consumption: dc.estimated_consumption,
      is_active: dc.is_active,
    }));
  }

  async findByUserAndDate(userId: string, date: string): Promise<DailyConsumptionDto[]> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const dailyConsumptions = await this.prisma.daily_consumptions.findMany({
      where: {
        user_id: userId,
        date: new Date(date),
        is_active: true
      },
      orderBy: { date: 'desc' },
    });

    return dailyConsumptions.map(dc => plainToInstance(DailyConsumptionDto, {
      id: dc.id,
      user_id: dc.user_id,
      device_id: dc.device_id,
      date: dc.date.toISOString().split('T')[0],
      hours_use: dc.hours_use,
      estimated_consumption: dc.estimated_consumption,
      is_active: dc.is_active,
    }));
  }

  async update(id: string, updateDailyConsumptionDto: UpdateDailyConsumptionDto): Promise<DailyConsumptionDto> {
    const existingRecord = await this.prisma.daily_consumptions.findUnique({
      where: { id },
      include: { devices: true },
    });

    if (!existingRecord) {
      throw new NotFoundException(`Daily consumption with ID ${id} not found`);
    }

    const estimated_consumption = updateDailyConsumptionDto.hours_use * existingRecord.devices.consumption_kwh_h;

    const data = await this.prisma.daily_consumptions.update({
      where: { id },
      data: {
        estimated_consumption,
        hours_use: updateDailyConsumptionDto.hours_use,
      }
    });

    return plainToInstance(DailyConsumptionDto, {
      id: data.id,
      user_id: data.user_id,
      device_id: data.device_id,
      date: data.date.toISOString().split('T')[0],
      hours_use: data.hours_use,
      estimated_consumption: data.estimated_consumption,
      is_active: data.is_active,
    });
  }

  async activate(id: string): Promise<DailyConsumptionDto> {
    const existingRecord = await this.prisma.daily_consumptions.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new NotFoundException(`Daily consumption with ID ${id} not found`);
    }

    const dailyConsumption = await this.prisma.daily_consumptions.update({
      where: { id },
      data: { is_active: true },
    });

    return plainToInstance(DailyConsumptionDto, {
      id: dailyConsumption.id,
      user_id: dailyConsumption.user_id,
      device_id: dailyConsumption.device_id,
      date: dailyConsumption.date.toISOString().split('T')[0],
      hours_use: dailyConsumption.hours_use,
      estimated_consumption: dailyConsumption.estimated_consumption,
      is_active: dailyConsumption.is_active,
    });
  }

  async deactivate(id: string): Promise<DailyConsumptionDto> {
    const existingRecord = await this.prisma.daily_consumptions.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new NotFoundException(`Daily consumption with ID ${id} not found`);
    }

    const dailyConsumption = await this.prisma.daily_consumptions.update({
      where: { id },
      data: { is_active: false },
    });

    return {
      ...dailyConsumption,
      date: dailyConsumption.date.toISOString().split('T')[0],
    } as DailyConsumptionDto;
  }

  async remove(id: string): Promise<DailyConsumptionDto> {
    const existingRecord = await this.prisma.daily_consumptions.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new NotFoundException(`Daily consumption with ID ${id} not found`);
    }

    const data = await this.prisma.daily_consumptions.delete({
      where: { id },
    });

    return plainToInstance(DailyConsumptionDto, {
      id: data.id,
      user_id: data.user_id,
      device_id: data.device_id,
      date: data.date.toISOString().split('T')[0],
      hours_use: data.hours_use,
      estimated_consumption: data.estimated_consumption,
      is_active: data.is_active,
    });
  }
}
