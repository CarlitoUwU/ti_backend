import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { NotificationsService } from './notifications.service';
import { DateService } from '../../common/services/date.service';
import { MonthEnum } from '../goals/dto/month.enum';

@Injectable()
export class AutomaticNotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly dateService: DateService,
  ) {}

  /**
   * Verifica si el usuario no ha ingresado su consumo diario y ya son más de las 18:00
   */
  async checkMissingDailyConsumption(userId: string): Promise<void> {
    try {
      const currentDate = this.dateService.getCurrentPeruDate();
      const currentHour = currentDate.getHours();

      // Solo verificar después de las 18:00
      if (currentHour < 18) return;

      const dateOnly = this.dateService.getCurrentPeruDateOnly();

      // Verificar si el usuario ya ingresó algún consumo hoy
      const todayConsumptions = await this.prisma.daily_consumptions.findMany({
        where: {
          user_id: userId,
          date: dateOnly,
          is_active: true,
        },
      });

      if (todayConsumptions.length === 0) {
        await this.notificationsService.createAutomaticNotification(
          userId,
          'Recordatorio: Consumo Diario Pendiente',
          '¡No olvides registrar tu consumo energético de hoy! Es importante mantener el seguimiento para alcanzar tus metas de ahorro.',
          'MISSING_DAILY_CONSUMPTION',
        );
      }
    } catch (error) {
      console.error(`Error checking missing daily consumption for user ${userId}:`, error.message);
    }
  }

  /**
   * Verifica si el usuario no ha establecido una meta mensual para el mes actual
   */
  async checkMissingMonthlyGoal(userId: string): Promise<void> {
    try {
      const currentDate = this.dateService.getCurrentPeruDate();
      const currentYear = currentDate.getFullYear();
      const currentMonth = this.getCurrentMonth(currentDate);

      // Verificar si existe una meta activa para este mes
      const existingGoal = await this.prisma.goals.findFirst({
        where: {
          user_id: userId,
          month: currentMonth,
          year: currentYear,
          is_active: true,
        },
      });

      if (!existingGoal) {
        await this.notificationsService.createAutomaticNotification(
          userId,
          'Meta Mensual Faltante',
          `¡Define tu meta de consumo energético para ${currentMonth} ${currentYear}! Una meta clara te ayudará a controlar mejor tu consumo y ahorrar en tu factura.`,
          'MISSING_MONTHLY_GOAL',
        );
      }
    } catch (error) {
      console.error(`Error checking missing monthly goal for user ${userId}:`, error.message);
    }
  }

  /**
   * Verifica si el usuario está cerca de alcanzar su límite de meta (80% del consumo permitido)
   */
  async checkNearGoalLimit(userId: string): Promise<void> {
    try {
      const currentDate = this.dateService.getCurrentPeruDate();
      const currentYear = currentDate.getFullYear();
      const currentMonth = this.getCurrentMonth(currentDate);

      // Obtener la meta del usuario para este mes
      const goal = await this.prisma.goals.findFirst({
        where: {
          user_id: userId,
          month: currentMonth,
          year: currentYear,
          is_active: true,
        },
      });

      if (!goal) return; // No hay meta establecida

      // Calcular consumo actual del mes
      const startDate = new Date(currentYear, currentDate.getMonth(), 1);
      const endDate = currentDate;

      const monthlyConsumptions = await this.prisma.daily_consumptions.findMany({
        where: {
          user_id: userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
          is_active: true,
        },
      });

      const totalConsumption = monthlyConsumptions.reduce(
        (sum, consumption) => sum + consumption.estimated_consumption,
        0,
      );

      // Verificar si está en el 80% de la meta
      const warningThreshold = goal.goal_kwh * 0.8;

      if (totalConsumption >= warningThreshold && totalConsumption < goal.goal_kwh) {
        const remainingKwh = goal.goal_kwh - totalConsumption;
        const percentageUsed = Math.round((totalConsumption / goal.goal_kwh) * 100);

        await this.notificationsService.createAutomaticNotification(
          userId,
          '⚠️ Cerca del Límite de Meta',
          `¡Atención! Has usado ${percentageUsed}% de tu meta mensual. Te quedan ${remainingKwh.toFixed(2)} kWh disponibles. ¡Cuida tu consumo para mantenerte dentro de la meta!`,
          'NEAR_GOAL_LIMIT',
        );
      }
    } catch (error) {
      console.error(`Error checking near goal limit for user ${userId}:`, error.message);
    }
  }

  /**
   * Verifica si el usuario ha superado su meta mensual
   */
  async checkGoalExceeded(userId: string): Promise<void> {
    try {
      const currentDate = this.dateService.getCurrentPeruDate();
      const currentYear = currentDate.getFullYear();
      const currentMonth = this.getCurrentMonth(currentDate);

      // Obtener la meta del usuario para este mes
      const goal = await this.prisma.goals.findFirst({
        where: {
          user_id: userId,
          month: currentMonth,
          year: currentYear,
          is_active: true,
        },
      });

      if (!goal) return; // No hay meta establecida

      // Calcular consumo actual del mes
      const startDate = new Date(currentYear, currentDate.getMonth(), 1);
      const endDate = currentDate;

      const monthlyConsumptions = await this.prisma.daily_consumptions.findMany({
        where: {
          user_id: userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
          is_active: true,
        },
      });

      const totalConsumption = monthlyConsumptions.reduce(
        (sum, consumption) => sum + consumption.estimated_consumption,
        0,
      );

      // Verificar si superó la meta
      if (totalConsumption > goal.goal_kwh) {
        const excess = totalConsumption - goal.goal_kwh;
        const percentageExceeded = Math.round(
          ((totalConsumption - goal.goal_kwh) / goal.goal_kwh) * 100,
        );

        await this.notificationsService.createAutomaticNotification(
          userId,
          '🚨 Meta Superada',
          `Has superado tu meta mensual por ${excess.toFixed(2)} kWh (${percentageExceeded}% más). Considera ajustar tus hábitos de consumo para el resto del mes y revisa tu próxima meta.`,
          'GOAL_EXCEEDED',
        );
      }
    } catch (error) {
      console.error(`Error checking goal exceeded for user ${userId}:`, error.message);
    }
  }

  /**
   * Notifica logros positivos cuando el usuario está ahorrando bien
   */
  async checkPositiveProgress(userId: string): Promise<void> {
    try {
      const currentDate = this.dateService.getCurrentPeruDate();
      const currentYear = currentDate.getFullYear();
      const currentMonth = this.getCurrentMonth(currentDate);

      // Obtener ahorros actuales
      const savings = await this.prisma.savings.findFirst({
        where: {
          user_id: userId,
          month: currentMonth,
          year: currentYear,
          is_active: true,
        },
      });

      if (savings && savings.savings_kwh > 0) {
        const totalConsumption = await this.getTotalConsumptionForMonth(
          userId,
          currentYear,
          currentDate.getMonth(),
        );
        const savingsPercentage = Math.round(
          (savings.savings_kwh / (savings.savings_kwh + totalConsumption)) * 100,
        );

        if (savingsPercentage >= 15) {
          // Si está ahorrando más del 15%
          await this.notificationsService.createAutomaticNotification(
            userId,
            '🎉 ¡Excelente Progreso!',
            `¡Felicitaciones! Estás ahorrando ${savings.savings_kwh.toFixed(2)} kWh este mes (${savingsPercentage}% de eficiencia). ¡Sigue así para maximizar tus ahorros!`,
            'POSITIVE_PROGRESS',
          );
        }
      }
    } catch (error) {
      console.error(`Error checking positive progress for user ${userId}:`, error.message);
    }
  }

  /**
   * Notifica al final del mes con resumen de desempeño
   */
  async checkMonthEndSummary(userId: string): Promise<void> {
    try {
      const currentDate = this.dateService.getCurrentPeruDate();
      const isLastDayOfMonth = this.isLastDayOfMonth(currentDate);

      if (!isLastDayOfMonth) return;

      const currentYear = currentDate.getFullYear();
      const currentMonth = this.getCurrentMonth(currentDate);

      // Obtener ahorros del mes
      const savings = await this.prisma.savings.findFirst({
        where: {
          user_id: userId,
          month: currentMonth,
          year: currentYear,
          is_active: true,
        },
      });

      if (savings) {
        let message = `Resumen de ${currentMonth} ${currentYear}: `;
        if (savings.savings_kwh > 0) {
          message += `¡Ahorraste ${savings.savings_kwh.toFixed(2)} kWh y S/ ${savings.savings_sol.toFixed(2)}! 🎉`;
        } else {
          message += `Consumiste ${Math.abs(savings.savings_kwh).toFixed(2)} kWh más de tu meta. ¡Ajusta tu estrategia para el próximo mes! 💪`;
        }

        await this.notificationsService.createAutomaticNotification(
          userId,
          'Resumen Mensual',
          message,
          'MONTH_END_SUMMARY',
        );
      }
    } catch (error) {
      console.error(`Error checking month end summary for user ${userId}:`, error.message);
    }
  }

  /**
   * Ejecuta verificaciones prioritarias cuando el usuario se loguea
   * Solo verifica notificaciones críticas para no sobrecargar el login
   */
  async runLoginChecksForUser(userId: string): Promise<void> {
    try {
      // Verificaciones críticas al login:
      await Promise.all([
        this.checkMissingMonthlyGoal(userId), // Importante: meta mensual faltante
        this.checkMissingDailyConsumption(userId), // Solo si ya son más de las 18:00
        this.checkGoalExceeded(userId), // Crítico: si ya superó la meta
      ]);
    } catch (error) {
      console.error(`Error running login checks for user ${userId}:`, error.message);
    }
  }

  /**
   * Ejecuta verificaciones programadas (para cron jobs)
   * Incluye todas las verificaciones menos las críticas del login
   */
  async runScheduledChecksForUser(userId: string): Promise<void> {
    try {
      await Promise.all([
        this.checkNearGoalLimit(userId), // Verificar semanalmente
        this.checkPositiveProgress(userId), // Verificar semanalmente
        this.checkMonthEndSummary(userId), // Solo último día del mes
      ]);
    } catch (error) {
      console.error(`Error running scheduled checks for user ${userId}:`, error.message);
    }
  }

  /**
   * Ejecuta verificaciones diarias automáticas (cron diario a las 18:00)
   */
  async runDailyChecksForAllUsers(): Promise<void> {
    try {
      const activeUsers = await this.prisma.users.findMany({
        where: { is_active: true },
        select: { id: true },
      });

      console.log(`Running daily notification checks for ${activeUsers.length} users...`);

      for (const user of activeUsers) {
        await this.checkMissingDailyConsumption(user.id);
      }

      console.log('Daily notification checks completed.');
    } catch (error) {
      console.error('Error running daily notification checks:', error.message);
    }
  }

  /**
   * Ejecuta verificaciones semanales (cron semanal)
   */
  async runWeeklyChecksForAllUsers(): Promise<void> {
    try {
      const activeUsers = await this.prisma.users.findMany({
        where: { is_active: true },
        select: { id: true },
      });

      console.log(`Running weekly notification checks for ${activeUsers.length} users...`);

      for (const user of activeUsers) {
        await Promise.all([this.checkNearGoalLimit(user.id), this.checkPositiveProgress(user.id)]);
      }

      console.log('Weekly notification checks completed.');
    } catch (error) {
      console.error('Error running weekly notification checks:', error.message);
    }
  }

  /**
   * Ejecuta verificaciones de fin de mes (cron último día del mes)
   */
  async runMonthEndChecksForAllUsers(): Promise<void> {
    try {
      const activeUsers = await this.prisma.users.findMany({
        where: { is_active: true },
        select: { id: true },
      });

      console.log(`Running month-end notification checks for ${activeUsers.length} users...`);

      for (const user of activeUsers) {
        await this.checkMonthEndSummary(user.id);
      }

      console.log('Month-end notification checks completed.');
    } catch (error) {
      console.error('Error running month-end notification checks:', error.message);
    }
  }

  /**
   * Ejecuta verificaciones de inicio de mes (cron primer día del mes)
   */
  async runMonthStartChecksForAllUsers(): Promise<void> {
    try {
      const activeUsers = await this.prisma.users.findMany({
        where: { is_active: true },
        select: { id: true },
      });

      console.log(`Running month-start notification checks for ${activeUsers.length} users...`);

      for (const user of activeUsers) {
        await this.checkMissingMonthlyGoal(user.id);
      }

      console.log('Month-start notification checks completed.');
    } catch (error) {
      console.error('Error running month-start notification checks:', error.message);
    }
  }

  /**
   * Ejecuta todas las verificaciones de notificaciones automáticas para un usuario
   */
  async runAllChecksForUser(userId: string): Promise<void> {
    await Promise.all([
      this.checkMissingDailyConsumption(userId),
      this.checkMissingMonthlyGoal(userId),
      this.checkNearGoalLimit(userId),
      this.checkGoalExceeded(userId),
      this.checkPositiveProgress(userId),
      this.checkMonthEndSummary(userId),
    ]);
  }

  /**
   * Ejecuta todas las verificaciones para todos los usuarios activos
   */
  async runAllChecksForAllUsers(): Promise<void> {
    try {
      const activeUsers = await this.prisma.users.findMany({
        where: { is_active: true },
        select: { id: true },
      });

      console.log(`Running automatic notification checks for ${activeUsers.length} users...`);

      for (const user of activeUsers) {
        await this.runAllChecksForUser(user.id);
      }

      console.log('Automatic notification checks completed.');
    } catch (error) {
      console.error('Error running automatic notification checks:', error.message);
    }
  }

  // Métodos auxiliares
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

  private isLastDayOfMonth(date: Date): boolean {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return date.getDate() === lastDay.getDate();
  }

  private async getTotalConsumptionForMonth(
    userId: string,
    year: number,
    month: number,
  ): Promise<number> {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const consumptions = await this.prisma.daily_consumptions.findMany({
      where: {
        user_id: userId,
        date: { gte: startDate, lte: endDate },
        is_active: true,
      },
    });

    return consumptions.reduce((sum, c) => sum + c.estimated_consumption, 0);
  }
}
