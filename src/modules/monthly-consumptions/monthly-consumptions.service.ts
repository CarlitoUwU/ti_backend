import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
  ) {}

  async create(
    createMonthlyConsumptionDto: CreateMonthlyConsumptionDto,
  ): Promise<MonthlyConsumptionDto> {
    // Verify that user exists
    await this.usersService.findOne(createMonthlyConsumptionDto.user_id);

    // Get current month and year (auto-calculated in backend using Peru timezone)
    const currentDate = this.dateService.getCurrentPeruDate();
    const currentMonth = this.getCurrentMonth(currentDate);
    const currentYear = currentDate.getFullYear();

    // Check if a record already exists for the same user, month, and year
    const existingRecord = await this.prisma.monthly_consumptions.findFirst({
      where: {
        user_id: createMonthlyConsumptionDto.user_id,
        month: currentMonth,
        year: currentYear,
        is_active: true,
      },
    });

    if (existingRecord) {
      throw new ConflictException(
        `A monthly consumption record already exists for user ${createMonthlyConsumptionDto.user_id} for ${currentMonth} ${currentYear}`,
      );
    }

    // Round values to 2 decimal places
    const kwhTotal = Math.round(createMonthlyConsumptionDto.kwh_total * 100) / 100;
    const kwhCost = Math.round(createMonthlyConsumptionDto.kwh_cost * 100) / 100;
    const amountPaid = Math.round(createMonthlyConsumptionDto.amount_paid * 100) / 100;

    const monthlyConsumption = await this.prisma.monthly_consumptions.create({
      data: {
        user_id: createMonthlyConsumptionDto.user_id,
        month: currentMonth,
        year: currentYear,
        kwh_total: kwhTotal,
        kwh_cost: kwhCost,
        amount_paid: amountPaid,
        is_active: true,
      },
    });

    return plainToInstance(MonthlyConsumptionDto, monthlyConsumption);
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

  async findAll(): Promise<MonthlyConsumptionDto[]> {
    const monthlyConsumptions = await this.prisma.monthly_consumptions.findMany({
      where: { is_active: true },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    return monthlyConsumptions.map((mc) => plainToInstance(MonthlyConsumptionDto, mc));
  }

  async findOne(id: string): Promise<MonthlyConsumptionDto> {
    const monthlyConsumption = await this.prisma.monthly_consumptions.findUnique({
      where: { id },
    });

    if (!monthlyConsumption || !monthlyConsumption.is_active) {
      throw new NotFoundException(`Monthly consumption with ID ${id} not found`);
    }

    return plainToInstance(MonthlyConsumptionDto, monthlyConsumption);
  }

  async findByUser(userId: string): Promise<MonthlyConsumptionDto[]> {
    // Verify that the user exists
    await this.usersService.findOne(userId);

    const monthlyConsumptions = await this.prisma.monthly_consumptions.findMany({
      where: {
        user_id: userId,
        is_active: true,
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    return monthlyConsumptions.map((mc) => plainToInstance(MonthlyConsumptionDto, mc));
  }

  async update(
    id: string,
    updateMonthlyConsumptionDto: UpdateMonthlyConsumptionDto,
  ): Promise<MonthlyConsumptionDto> {
    // Check if the record exists
    const existingRecord = await this.prisma.monthly_consumptions.findUnique({
      where: { id },
    });

    if (!existingRecord || !existingRecord.is_active) {
      throw new NotFoundException(`Monthly consumption with ID ${id} not found`);
    }

    // Prepare update data with rounded values where applicable
    const updateData: any = {};

    if (updateMonthlyConsumptionDto.kwh_total !== undefined) {
      updateData.kwh_total = Math.round(updateMonthlyConsumptionDto.kwh_total * 100) / 100;
    }

    if (updateMonthlyConsumptionDto.kwh_cost !== undefined) {
      updateData.kwh_cost = Math.round(updateMonthlyConsumptionDto.kwh_cost * 100) / 100;
    }

    if (updateMonthlyConsumptionDto.amount_paid !== undefined) {
      updateData.amount_paid = Math.round(updateMonthlyConsumptionDto.amount_paid * 100) / 100;
    }

    if (updateMonthlyConsumptionDto.is_active !== undefined) {
      updateData.is_active = updateMonthlyConsumptionDto.is_active;
    }

    const updatedMonthlyConsumption = await this.prisma.monthly_consumptions.update({
      where: { id },
      data: updateData,
    });

    return plainToInstance(MonthlyConsumptionDto, updatedMonthlyConsumption);
  }

  async remove(id: string): Promise<{ message: string }> {
    // Check if the record exists
    const existingRecord = await this.prisma.monthly_consumptions.findUnique({
      where: { id },
    });

    if (!existingRecord || !existingRecord.is_active) {
      throw new NotFoundException(`Monthly consumption with ID ${id} not found`);
    }

    // Soft delete by setting is_active to false
    await this.prisma.monthly_consumptions.update({
      where: { id },
      data: { is_active: false },
    });

    return { message: `Monthly consumption record has been successfully deleted` };
  }
}
