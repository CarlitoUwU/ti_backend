import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalDto } from './dto/goal.dto';
import { plainToInstance } from 'class-transformer';
import { MonthEnum } from './dto/month.enum';
import { DateService } from '../../common/services/date.service';
import { AutomaticNotificationsService } from '../notifications/automatic-notifications.service';

@Injectable()
export class GoalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dateService: DateService,
    private readonly automaticNotificationsService: AutomaticNotificationsService,
  ) { }

  async create(createGoalDto: CreateGoalDto): Promise<GoalDto> {
    // First, get the user's district to calculate goal_kwh
    const user = await this.prisma.users.findUnique({
      where: { id: createGoalDto.user_id },
      include: { districts: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${createGoalDto.user_id} not found`);
    }

    if (!user.districts) {
      throw new NotFoundException(`District not found for user with ID ${createGoalDto.user_id}`);
    }

    // Get current month and year from system date
    const currentDate = this.dateService.getCurrentPeruDate();
    const currentMonth = this.getCurrentMonth(currentDate);
    const currentYear = currentDate.getFullYear();

    // Check if a goal already exists for the same user, month, and year
    const existingGoal = await this.prisma.goals.findFirst({
      where: {
        user_id: createGoalDto.user_id,
        month: currentMonth,
        year: currentYear,
        is_active: true,
      },
    });

    if (existingGoal) {
      throw new ConflictException(`Goal already exists for user ${createGoalDto.user_id} for the month ${currentMonth} and year ${currentYear}`);
    }

    // Calculate goal_kwh based on estimated_cost / district's fee_kwh
    const goal_kwh = createGoalDto.estimated_cost / user.districts.fee_kwh;

    const goal = await this.prisma.goals.create({
      data: {
        user_id: createGoalDto.user_id,
        month: currentMonth,
        year: currentYear,
        goal_kwh: Math.round(goal_kwh * 100) / 100, // Round to 2 decimal places
        estimated_cost: createGoalDto.estimated_cost,
        is_active: createGoalDto.is_active ?? true,
      },
    });

    // Ejecutar verificaciones automáticas de notificaciones después de crear una meta
    try {
      await this.automaticNotificationsService.runAllChecksForUser(createGoalDto.user_id);
    } catch (error) {
      console.error(`Error running automatic notifications for user ${createGoalDto.user_id}:`, error.message);
    }

    return plainToInstance(GoalDto, {
      id: goal.id,
      user_id: goal.user_id,
      month: goal.month,
      year: goal.year,
      goal_kwh: goal.goal_kwh,
      estimated_cost: goal.estimated_cost,
      is_active: goal.is_active,
    });
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

  async findAll(): Promise<GoalDto[]> {
    const goals = await this.prisma.goals.findMany({
      where: { is_active: true },
      orderBy: [{ year: 'desc' }, { month: 'asc' }],
    });

    return goals.map(goal => plainToInstance(GoalDto, {
      id: goal.id,
      user_id: goal.user_id,
      month: goal.month,
      year: goal.year,
      goal_kwh: goal.goal_kwh,
      estimated_cost: goal.estimated_cost,
      is_active: goal.is_active,
    }));
  }

  async findOne(id: string): Promise<GoalDto> {
    const goal = await this.prisma.goals.findUnique({
      where: { id },
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    return plainToInstance(GoalDto, {
      id: goal.id,
      user_id: goal.user_id,
      month: goal.month,
      year: goal.year,
      goal_kwh: goal.goal_kwh,
      estimated_cost: goal.estimated_cost,
      is_active: goal.is_active,
    });
  }

  async findByUser(userId: string): Promise<GoalDto[]> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const goals = await this.prisma.goals.findMany({
      where: {
        user_id: userId,
        is_active: true
      },
      orderBy: [{ year: 'desc' }, { month: 'asc' }],
    });

    return goals.map(goal => plainToInstance(GoalDto, {
      id: goal.id,
      user_id: goal.user_id,
      month: goal.month,
      year: goal.year,
      goal_kwh: goal.goal_kwh,
      estimated_cost: goal.estimated_cost,
      is_active: goal.is_active,
    }));
  }

  async findByUserAndPeriod(userId: string, month: string, year: number): Promise<GoalDto[]> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const goals = await this.prisma.goals.findMany({
      where: {
        user_id: userId,
        month: month as any,
        year: year,
        is_active: true
      },
    });

    return goals.map(goal => plainToInstance(GoalDto, {
      id: goal.id,
      user_id: goal.user_id,
      month: goal.month,
      year: goal.year,
      goal_kwh: goal.goal_kwh,
      estimated_cost: goal.estimated_cost,
      is_active: goal.is_active,
    }));
  }

  async update(id: string, updateGoalDto: UpdateGoalDto): Promise<GoalDto> {
    const existingGoal = await this.prisma.goals.findUnique({
      where: { id },
      include: { users: { include: { districts: true } } },
    });

    if (!existingGoal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    let estimated_cost = existingGoal.estimated_cost;

    if (updateGoalDto.goal_kwh !== undefined) {
      if (!existingGoal.users.districts) {
        throw new NotFoundException(`District not found for user with ID ${existingGoal.user_id}`);
      }
      estimated_cost = updateGoalDto.goal_kwh * existingGoal.users.districts.fee_kwh;
    }

    const goal = await this.prisma.goals.update({
      where: { id },
      data: {
        ...updateGoalDto,
        estimated_cost,
      },
    });

    // Ejecutar verificaciones automáticas de notificaciones después de actualizar una meta
    try {
      await this.automaticNotificationsService.runAllChecksForUser(existingGoal.user_id);
    } catch (error) {
      console.error(`Error running automatic notifications for user ${existingGoal.user_id}:`, error.message);
    }

    return plainToInstance(GoalDto, {
      id: goal.id,
      user_id: goal.user_id,
      month: goal.month,
      year: goal.year,
      goal_kwh: goal.goal_kwh,
      estimated_cost: goal.estimated_cost,
      is_active: goal.is_active,
    });
  }

  async activate(id: string): Promise<GoalDto> {
    const existingGoal = await this.prisma.goals.findUnique({
      where: { id },
    });

    if (!existingGoal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    const goal = await this.prisma.goals.update({
      where: { id },
      data: { is_active: true },
    });

    return plainToInstance(GoalDto, {
      id: goal.id,
      user_id: goal.user_id,
      month: goal.month,
      year: goal.year,
      goal_kwh: goal.goal_kwh,
      estimated_cost: goal.estimated_cost,
      is_active: goal.is_active,
    });
  }

  async deactivate(id: string): Promise<GoalDto> {
    const existingGoal = await this.prisma.goals.findUnique({
      where: { id },
    });

    if (!existingGoal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    const goal = await this.prisma.goals.update({
      where: { id },
      data: { is_active: false },
    });

    return plainToInstance(GoalDto, {
      id: goal.id,
      user_id: goal.user_id,
      month: goal.month,
      year: goal.year,
      goal_kwh: goal.goal_kwh,
      estimated_cost: goal.estimated_cost,
      is_active: goal.is_active,
    });
  }

  async remove(id: string): Promise<GoalDto> {
    const existingGoal = await this.prisma.goals.findUnique({
      where: { id },
    });

    if (!existingGoal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    const data = await this.prisma.goals.delete({
      where: { id },
    });

    return plainToInstance(GoalDto, {
      id: data.id,
      user_id: data.user_id,
      month: data.month,
      year: data.year,
      goal_kwh: data.goal_kwh,
      estimated_cost: data.estimated_cost,
      is_active: data.is_active,
    });
  }
}
