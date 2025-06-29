import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AutomaticNotificationsService } from '../../modules/notifications/automatic-notifications.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly automaticNotificationsService: AutomaticNotificationsService,
  ) { }

  // Ejecutar todos los días a las 18:00 (hora de Perú)
  @Cron('0 18 * * *', {
    name: 'daily-consumption-reminder',
    timeZone: 'America/Lima',
  })
  async handleDailyConsumptionReminder() {
    console.log('Executing daily consumption reminder notifications...');
    try {
      await this.automaticNotificationsService.runDailyChecksForAllUsers();
      console.log('Daily consumption reminder notifications completed successfully');
    } catch (error) {
      console.error('Error in daily consumption reminder notifications:', error);
    }
  }

  // Ejecutar todos los domingos a las 10:00 (hora de Perú)
  @Cron('0 10 * * 0', {
    name: 'weekly-progress-check',
    timeZone: 'America/Lima',
  })
  async handleWeeklyProgressCheck() {
    console.log('Executing weekly progress check notifications...');
    try {
      await this.automaticNotificationsService.runWeeklyChecksForAllUsers();
      console.log('Weekly progress check notifications completed successfully');
    } catch (error) {
      console.error('Error in weekly progress check notifications:', error);
    }
  }

  // Ejecutar el primer día de cada mes a las 09:00 (hora de Perú)
  @Cron('0 9 1 * *', {
    name: 'monthly-goal-reminder',
    timeZone: 'America/Lima',
  })
  async handleMonthlyGoalReminder() {
    console.log('Executing monthly goal reminder notifications...');
    try {
      await this.automaticNotificationsService.runMonthStartChecksForAllUsers();
      console.log('Monthly goal reminder notifications completed successfully');
    } catch (error) {
      console.error('Error in monthly goal reminder notifications:', error);
    }
  }

  // Ejecutar el último día de cada mes a las 20:00 (hora de Perú)
  // Nota: Para el último día del mes, usaremos una lógica más compleja
  @Cron('0 20 28-31 * *', {
    name: 'monthly-summary',
    timeZone: 'America/Lima',
  })
  async handleMonthlySummary() {
    // Verificar si es realmente el último día del mes
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const today = new Date();
    const isLastDayOfMonth = tomorrow.getMonth() !== today.getMonth();

    if (!isLastDayOfMonth) {
      console.log('Skipping monthly summary - not the last day of the month');
      return;
    }

    console.log('Executing monthly summary notifications...');
    try {
      await this.automaticNotificationsService.runMonthEndChecksForAllUsers();
      console.log('Monthly summary notifications completed successfully');
    } catch (error) {
      console.error('Error in monthly summary notifications:', error);
    }
  }

  // Método manual para testing (opcional)
  async executeAllTasksForTesting() {
    console.log('Executing all notification tasks for testing...');
    await Promise.all([
      this.handleDailyConsumptionReminder(),
      this.handleWeeklyProgressCheck(),
      this.handleMonthlyGoalReminder(),
      this.handleMonthlySummary(),
    ]);
    console.log('All notification tasks completed for testing');
  }
}
