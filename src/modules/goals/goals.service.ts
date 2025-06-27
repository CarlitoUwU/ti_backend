import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalDto } from './dto/goal.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createGoalDto: CreateGoalDto): Promise<GoalDto> {
    const user = await this.prisma.users.findUnique({
      where: { id: createGoalDto.user_id },
      include: { districts: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${createGoalDto.user_id} not found`);
    }

    const existingGoal = await this.prisma.goals.findFirst({
      where: {
        user_id: createGoalDto.user_id,
        month: createGoalDto.month as any,
        year: createGoalDto.year,
        is_active: true,
      },
    });

    if (existingGoal) {
      throw new NotFoundException(`Goal already exists for user ${createGoalDto.user_id} for the month ${createGoalDto.month} and year ${createGoalDto.year}`);
    }

    if (!user.districts) {
      throw new NotFoundException(`District not found for user with ID ${createGoalDto.user_id}`);
    }

    const estimated_cost = createGoalDto.goal_kwh * user.districts.fee_kwh;

    const goal = await this.prisma.goals.create({
      data: {
        user_id: createGoalDto.user_id,
        month: createGoalDto.month,
        year: createGoalDto.year,
        goal_kwh: createGoalDto.goal_kwh,
        estimated_cost,
        is_active: createGoalDto.is_active ?? true,
      },
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
