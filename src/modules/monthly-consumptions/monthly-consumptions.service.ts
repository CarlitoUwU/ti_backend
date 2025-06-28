import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateMonthlyConsumptionDto } from './dto/create-monthly-consumption.dto';
import { UpdateMonthlyConsumptionDto } from './dto/update-monthly-consumption.dto';
import { MonthlyConsumptionDto } from './dto/monthly-consumption.dto';
import { plainToInstance } from 'class-transformer';
import { MonthEnum } from '../goals/dto/month.enum';
import { UsersService } from '../users/users.service';
import { DateService } from '../../common/services/date.service';

@Injectable()
export class MonthlyConsumptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly dateService: DateService,
  ) { }

  async create(createMonthlyConsumptionDto: CreateMonthlyConsumptionDto): Promise<MonthlyConsumptionDto> {
    // First, verify that user exists and get user with district
    const user = await this.usersService.findOne(createMonthlyConsumptionDto.user_id);

    if (!user.district) {
      throw new NotFoundException(`District not found for user with ID ${createMonthlyConsumptionDto.user_id}`);
    }

    // Get current month and year
    const currentDate = this.dateService.getCurrentPeruDate();
    const currentMonth = this.getCurrentMonth(currentDate);
    const currentYear = currentDate.getFullYear();

    // Check if a record already exists for the same user, month, and year
    const existingRecord = await this.prisma.monthly_consumptions.findFirst({
      where: {
        user_id: createMonthlyConsumptionDto.user_id,
        month: currentMonth,
        year: currentYear,
      },
    });

    if (existingRecord) {
      throw new ConflictException(
        `A monthly consumption record already exists for user ${createMonthlyConsumptionDto.user_id}, month ${currentMonth}, and year ${currentYear}`
      );
    }

    // Calculate monthly consumption
    const { kwh_total, kwh_cost, amount_paid } = await this.calculateMonthlyConsumption(
      createMonthlyConsumptionDto.user_id,
      currentMonth,
      currentYear,
      user.district.fee_kwh
    );

    const monthlyConsumption = await this.prisma.monthly_consumptions.create({
      data: {
        user_id: createMonthlyConsumptionDto.user_id,
        month: currentMonth,
        year: currentYear,
        kwh_total,
        kwh_cost,
        amount_paid,
        is_active: true,
      },
    });

    return plainToInstance(MonthlyConsumptionDto, {
      id: monthlyConsumption.id,
      user_id: monthlyConsumption.user_id,
      month: monthlyConsumption.month,
      year: monthlyConsumption.year,
      kwh_total: monthlyConsumption.kwh_total,
      kwh_cost: monthlyConsumption.kwh_cost,
      amount_paid: monthlyConsumption.amount_paid,
      is_active: monthlyConsumption.is_active,
    });
  }

  private async calculateMonthlyConsumption(
    userId: string,
    month: MonthEnum,
    year: number,
    feeKwh: number
  ): Promise<{ kwh_total: number; kwh_cost: number; amount_paid: number }> {
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

    // Calculate total consumption in kWh
    const kwh_total = dailyConsumptions.reduce(
      (sum, consumption) => sum + consumption.estimated_consumption,
      0
    );

    // kwh_cost is the fee per kWh from the district
    const kwh_cost = feeKwh;

    // Calculate total amount paid: kwh_total * kwh_cost
    const amount_paid = kwh_total * kwh_cost;

    return {
      kwh_total: Math.round(kwh_total * 100) / 100, // Round to 2 decimal places
      kwh_cost: Math.round(kwh_cost * 100) / 100, // Round to 2 decimal places
      amount_paid: Math.round(amount_paid * 100) / 100, // Round to 2 decimal places
    };
  }

  private getCurrentMonth(date: Date): MonthEnum {
    const monthNames: MonthEnum[] = [
      MonthEnum.January,
      MonthEnum.February,
      MonthEnum.March,
      MonthEnum.April,
      MonthEnum.May,
      MonthEnum.June,
      MonthEnum.July,
      MonthEnum.August,
      MonthEnum.September,
      MonthEnum.October,
      MonthEnum.November,
      MonthEnum.December,
    ];
    return monthNames[date.getMonth()];
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

  async findAll(): Promise<MonthlyConsumptionDto[]> {
    const monthlyConsumptions = await this.prisma.monthly_consumptions.findMany({
      where: { is_active: true },
      orderBy: [{ year: 'desc' }, { month: 'asc' }],
    });

    return monthlyConsumptions.map(mc => plainToInstance(MonthlyConsumptionDto, {
      id: mc.id,
      user_id: mc.user_id,
      month: mc.month,
      year: mc.year,
      kwh_total: mc.kwh_total,
      kwh_cost: mc.kwh_cost,
      amount_paid: mc.amount_paid,
      is_active: mc.is_active,
    }));
  }

  async findOne(id: string): Promise<MonthlyConsumptionDto> {
    const monthlyConsumption = await this.prisma.monthly_consumptions.findUnique({
      where: { id },
    });

    if (!monthlyConsumption) {
      throw new NotFoundException(`Monthly consumption with ID ${id} not found`);
    }

    return plainToInstance(MonthlyConsumptionDto, {
      id: monthlyConsumption.id,
      user_id: monthlyConsumption.user_id,
      month: monthlyConsumption.month,
      year: monthlyConsumption.year,
      kwh_total: monthlyConsumption.kwh_total,
      kwh_cost: monthlyConsumption.kwh_cost,
      amount_paid: monthlyConsumption.amount_paid,
      is_active: monthlyConsumption.is_active,
    });
  }

  async findByUser(userId: string): Promise<MonthlyConsumptionDto[]> {
    // First verify that the user exists using the users service
    await this.usersService.findOne(userId);

    const monthlyConsumptions = await this.prisma.monthly_consumptions.findMany({
      where: {
        user_id: userId,
        is_active: true
      },
      orderBy: [{ year: 'desc' }, { month: 'asc' }],
    });

    return monthlyConsumptions.map(mc => plainToInstance(MonthlyConsumptionDto, {
      id: mc.id,
      user_id: mc.user_id,
      month: mc.month,
      year: mc.year,
      kwh_total: mc.kwh_total,
      kwh_cost: mc.kwh_cost,
      amount_paid: mc.amount_paid,
      is_active: mc.is_active,
    }));
  }

  async findByUserAndPeriod(userId: string, month: MonthEnum, year: number): Promise<MonthlyConsumptionDto[]> {
    // First verify that the user exists using the users service
    await this.usersService.findOne(userId);

    const monthlyConsumptions = await this.prisma.monthly_consumptions.findMany({
      where: {
        user_id: userId,
        month: month,
        year: year,
        is_active: true
      },
    });

    return monthlyConsumptions.map(mc => plainToInstance(MonthlyConsumptionDto, {
      id: mc.id,
      user_id: mc.user_id,
      month: mc.month,
      year: mc.year,
      kwh_total: mc.kwh_total,
      kwh_cost: mc.kwh_cost,
      amount_paid: mc.amount_paid,
      is_active: mc.is_active,
    }));
  }

  async update(id: string, updateMonthlyConsumptionDto: UpdateMonthlyConsumptionDto): Promise<MonthlyConsumptionDto> {
    // First check if the monthly consumption exists
    const existingRecord = await this.prisma.monthly_consumptions.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new NotFoundException(`Monthly consumption with ID ${id} not found`);
    }

    // Verify user exists and get district information using users service
    const user = await this.usersService.findOne(existingRecord.user_id);

    if (!user.district) {
      throw new NotFoundException(`District not found for user with ID ${existingRecord.user_id}`);
    }

    // Recalculate monthly consumption (this is the main purpose of update)
    const { kwh_total, kwh_cost, amount_paid } = await this.calculateMonthlyConsumption(
      existingRecord.user_id,
      existingRecord.month as MonthEnum,
      existingRecord.year,
      user.district.fee_kwh
    );

    const monthlyConsumption = await this.prisma.monthly_consumptions.update({
      where: { id },
      data: {
        kwh_total,
        kwh_cost,
        amount_paid,
        is_active: updateMonthlyConsumptionDto.is_active ?? existingRecord.is_active,
      },
    });

    return plainToInstance(MonthlyConsumptionDto, {
      id: monthlyConsumption.id,
      user_id: monthlyConsumption.user_id,
      month: monthlyConsumption.month,
      year: monthlyConsumption.year,
      kwh_total: monthlyConsumption.kwh_total,
      kwh_cost: monthlyConsumption.kwh_cost,
      amount_paid: monthlyConsumption.amount_paid,
      is_active: monthlyConsumption.is_active,
    });
  }

  async activate(id: string): Promise<MonthlyConsumptionDto> {
    const existingRecord = await this.prisma.monthly_consumptions.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new NotFoundException(`Monthly consumption with ID ${id} not found`);
    }

    const monthlyConsumption = await this.prisma.monthly_consumptions.update({
      where: { id },
      data: { is_active: true },
    });

    return plainToInstance(MonthlyConsumptionDto, {
      id: monthlyConsumption.id,
      user_id: monthlyConsumption.user_id,
      month: monthlyConsumption.month,
      year: monthlyConsumption.year,
      kwh_total: monthlyConsumption.kwh_total,
      kwh_cost: monthlyConsumption.kwh_cost,
      amount_paid: monthlyConsumption.amount_paid,
      is_active: monthlyConsumption.is_active,
    });
  }

  async deactivate(id: string): Promise<MonthlyConsumptionDto> {
    const existingRecord = await this.prisma.monthly_consumptions.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new NotFoundException(`Monthly consumption with ID ${id} not found`);
    }

    const monthlyConsumption = await this.prisma.monthly_consumptions.update({
      where: { id },
      data: { is_active: false },
    });

    return plainToInstance(MonthlyConsumptionDto, {
      id: monthlyConsumption.id,
      user_id: monthlyConsumption.user_id,
      month: monthlyConsumption.month,
      year: monthlyConsumption.year,
      kwh_total: monthlyConsumption.kwh_total,
      kwh_cost: monthlyConsumption.kwh_cost,
      amount_paid: monthlyConsumption.amount_paid,
      is_active: monthlyConsumption.is_active,
    });
  }

  async remove(id: string): Promise<MonthlyConsumptionDto> {
    const existingRecord = await this.prisma.monthly_consumptions.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new NotFoundException(`Monthly consumption with ID ${id} not found`);
    }

    const data = await this.prisma.monthly_consumptions.delete({
      where: { id },
    });

    return plainToInstance(MonthlyConsumptionDto, {
      id: data.id,
      user_id: data.user_id,
      month: data.month,
      year: data.year,
      kwh_total: data.kwh_total,
      kwh_cost: data.kwh_cost,
      amount_paid: data.amount_paid,
      is_active: data.is_active,
    });
  }
}
