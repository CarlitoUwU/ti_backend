import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  /**
   * Obtiene la fecha actual de Perú como Date object
   */
  getCurrentPeruDate(): Date {
    return new Date();
  }

  /**
   * Obtiene solo la fecha (sin hora) de Perú
   */
  getCurrentPeruDateOnly(): Date {
    const now = this.getCurrentPeruDate();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  /**
   * Convierte una fecha a formato string YYYY-MM-DD
   */
  formatDateToString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Obtiene la fecha actual de Perú en formato string YYYY-MM-DD
   */
  getCurrentPeruDateString(): string {
    return this.formatDateToString(this.getCurrentPeruDateOnly());
  }

  /**
   * Crea una fecha desde un string YYYY-MM-DD
   */
  createDateFromString(dateString: string): Date {
    return new Date(dateString);
  }
}
