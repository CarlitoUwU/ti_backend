import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateSavingDto } from './dto/create-saving.dto';
import { SavingDto } from './dto/saving.dto';
import { plainToInstance } from 'class-transformer';
import { MonthEnum } from '../goals/dto/month.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class SavingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) { }

  async create(createSavingDto: CreateSavingDto): Promise<SavingDto> {
    // First, verify that user exists and get user with district
    const user = await this.usersService.findOne(createSavingDto.user_id);

    if (!user.district) {
      throw new NotFoundException(`District not found for user with ID ${createSavingDto.user_id}`);
    }

    const hoy = new Date();
    const currentYear = hoy.getFullYear();
    const currentMonth = hoy.getMonth() + 1; // getMonth() returns 0-11, so we add 1
    const month = this.getNumberMonth(currentMonth);

    // Check if a saving record already exists for the same user, month, and year
    const existingRecord = await this.prisma.savings.findFirst({
      where: {
        user_id: createSavingDto.user_id,
        month: month,
        year: currentYear,
      },
    });

    if (existingRecord) {
      throw new ConflictException(
        `A saving record already exists for user ${createSavingDto.user_id}, month ${month}, and year ${currentYear}`
      );
    }

    // Calculate savings
    const { savings_kwh, savings_sol } = await this.calculateSavings(
      createSavingDto.user_id,
      month,
      currentYear,
      user.district.fee_kwh
    );

    const saving = await this.prisma.savings.create({
      data: {
        user_id: createSavingDto.user_id,
        month: month,
        year: currentYear,
        savings_kwh,
        savings_sol,
        is_active: true,
      },
    });

    return plainToInstance(SavingDto, {
      id: saving.id,
      user_id: saving.user_id,
      month: saving.month,
      year: saving.year,
      savings_kwh: saving.savings_kwh,
      savings_sol: saving.savings_sol,
      is_active: saving.is_active,
    });
  }

  private async calculateSavings(userId: string, month: MonthEnum, year: number, feeKwh: number): Promise<{ savings_kwh: number; savings_sol: number }> {
    // Get the goal for this user, month, and year
    const goal = await this.prisma.goals.findFirst({
      where: {
        user_id: userId,
        month: month,
        year: year,
        is_active: true,
      },
    });

    if (!goal) {
      throw new BadRequestException(
        `No active goal found for user ${userId}, month ${month}, and year ${year}. A goal is required to calculate savings.`
      );
    }

    // Get all daily consumptions for this user in the specified month and year
    const startDate = new Date(year, this.getMonthNumber(month) - 1, 1);
    const endDate = new Date(year, this.getMonthNumber(month), 0); // Last day of the month

    const dailyConsumptions = await this.prisma.daily_consumptions.findMany({
      where: {
        user_id: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        is_active: true,
      },
    });

    // Calculate total actual consumption in kWh
    const totalActualConsumption = dailyConsumptions.reduce(
      (sum, consumption) => sum + consumption.estimated_consumption,
      0
    );

    // Calculate savings: goal_kwh - actual_consumption
    const savings_kwh = goal.goal_kwh - totalActualConsumption;

    // Calculate savings in soles: savings_kwh * district_fee_kwh
    const savings_sol = savings_kwh * feeKwh;

    return {
      savings_kwh: Math.round(savings_kwh * 100) / 100, // Round to 2 decimal places
      savings_sol: Math.round(savings_sol * 100) / 100, // Round to 2 decimal places
    };
  }

  private getMonthNumber(month: MonthEnum): number {
    const monthMap: Record<MonthEnum, number> = {
      [MonthEnum.January]: 1,
      [MonthEnum.February]: 2,
      [MonthEnum.March]: 3,
      [MonthEnum.April]: 4,
      [MonthEnum.May]: 5,
      [MonthEnum.June]: 6,
      [MonthEnum.July]: 7,
      [MonthEnum.August]: 8,
      [MonthEnum.September]: 9,
      [MonthEnum.October]: 10,
      [MonthEnum.November]: 11,
      [MonthEnum.December]: 12,
    };
    return monthMap[month];
  }

  private getNumberMonth(month: number): MonthEnum {
    const monthMap: Record<number, MonthEnum> = {
      1: MonthEnum.January,
      2: MonthEnum.February,
      3: MonthEnum.March,
      4: MonthEnum.April,
      5: MonthEnum.May,
      6: MonthEnum.June,
      7: MonthEnum.July,
      8: MonthEnum.August,
      9: MonthEnum.September,
      10: MonthEnum.October,
      11: MonthEnum.November,
      12: MonthEnum.December,
    };
    return monthMap[month];
  }


  async findAll(): Promise<SavingDto[]> {
    const savings = await this.prisma.savings.findMany({
      where: { is_active: true },
      orderBy: [{ year: 'desc' }, { month: 'asc' }],
    });

    return savings.map(saving => plainToInstance(SavingDto, {
      id: saving.id,
      user_id: saving.user_id,
      month: saving.month,
      year: saving.year,
      savings_kwh: saving.savings_kwh,
      savings_sol: saving.savings_sol,
      is_active: saving.is_active,
    }));
  }

  async findOne(id: string): Promise<SavingDto> {
    const saving = await this.prisma.savings.findUnique({
      where: { id },
    });

    if (!saving) {
      throw new NotFoundException(`Saving with ID ${id} not found`);
    }

    return plainToInstance(SavingDto, {
      id: saving.id,
      user_id: saving.user_id,
      month: saving.month,
      year: saving.year,
      savings_kwh: saving.savings_kwh,
      savings_sol: saving.savings_sol,
      is_active: saving.is_active,
    });
  }

  async findByUser(userId: string): Promise<SavingDto[]> {
    // First verify that the user exists using the users service
    await this.usersService.findOne(userId);

    const savings = await this.prisma.savings.findMany({
      where: {
        user_id: userId,
        is_active: true
      },
      orderBy: [{ year: 'desc' }, { month: 'asc' }],
    });

    return savings.map(saving => plainToInstance(SavingDto, {
      id: saving.id,
      user_id: saving.user_id,
      month: saving.month,
      year: saving.year,
      savings_kwh: saving.savings_kwh,
      savings_sol: saving.savings_sol,
      is_active: saving.is_active,
    }));
  }

  async findByUserAndPeriod(userId: string, month: MonthEnum, year: number): Promise<SavingDto[]> {
    // First verify that the user exists using the users service
    await this.usersService.findOne(userId);

    const savings = await this.prisma.savings.findMany({
      where: {
        user_id: userId,
        month: month,
        year: year,
        is_active: true
      },
    });

    return savings.map(saving => plainToInstance(SavingDto, {
      id: saving.id,
      user_id: saving.user_id,
      month: saving.month,
      year: saving.year,
      savings_kwh: saving.savings_kwh,
      savings_sol: saving.savings_sol,
      is_active: saving.is_active,
    }));
  }

  async update(id: string): Promise<SavingDto> {
    // First check if the saving exists
    const existingSaving = await this.prisma.savings.findUnique({
      where: { id },
    });

    if (!existingSaving) {
      throw new NotFoundException(`Saving with ID ${id} not found`);
    }

    // Verify user exists and get district information using users service
    const user = await this.usersService.findOne(existingSaving.user_id);

    if (!user.district) {
      throw new NotFoundException(`District not found for user with ID ${existingSaving.user_id}`);
    }

    // Recalculate savings (this is the main purpose of update)
    const { savings_kwh, savings_sol } = await this.calculateSavings(
      existingSaving.user_id,
      existingSaving.month as MonthEnum,
      existingSaving.year,
      user.district.fee_kwh
    );

    const saving = await this.prisma.savings.update({
      where: { id },
      data: {
        savings_kwh,
        savings_sol,
      },
    });

    return plainToInstance(SavingDto, {
      id: saving.id,
      user_id: saving.user_id,
      month: saving.month,
      year: saving.year,
      savings_kwh: saving.savings_kwh,
      savings_sol: saving.savings_sol,
      is_active: saving.is_active,
    });
  }

  async activate(id: string): Promise<SavingDto> {
    const existingSaving = await this.prisma.savings.findUnique({
      where: { id },
    });

    if (!existingSaving) {
      throw new NotFoundException(`Saving with ID ${id} not found`);
    }

    const saving = await this.prisma.savings.update({
      where: { id },
      data: { is_active: true },
    });

    return plainToInstance(SavingDto, {
      id: saving.id,
      user_id: saving.user_id,
      month: saving.month,
      year: saving.year,
      savings_kwh: saving.savings_kwh,
      savings_sol: saving.savings_sol,
      is_active: saving.is_active,
    });
  }

  async deactivate(id: string): Promise<SavingDto> {
    const existingSaving = await this.prisma.savings.findUnique({
      where: { id },
    });

    if (!existingSaving) {
      throw new NotFoundException(`Saving with ID ${id} not found`);
    }

    const saving = await this.prisma.savings.update({
      where: { id },
      data: { is_active: false },
    });

    return plainToInstance(SavingDto, {
      id: saving.id,
      user_id: saving.user_id,
      month: saving.month,
      year: saving.year,
      savings_kwh: saving.savings_kwh,
      savings_sol: saving.savings_sol,
      is_active: saving.is_active,
    });
  }

  async remove(id: string): Promise<SavingDto> {
    const existingSaving = await this.prisma.savings.findUnique({
      where: { id },
    });

    if (!existingSaving) {
      throw new NotFoundException(`Saving with ID ${id} not found`);
    }

    const data = await this.prisma.savings.delete({
      where: { id },
    });

    return plainToInstance(SavingDto, {
      id: data.id,
      user_id: data.user_id,
      month: data.month,
      year: data.year,
      savings_kwh: data.savings_kwh,
      savings_sol: data.savings_sol,
      is_active: data.is_active,
    });
  }
}
