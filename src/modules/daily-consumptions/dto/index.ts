import { OmitType } from '@nestjs/swagger';
import { DailyConsumptionDto } from './daily-consumption.dto';

export class DailyConsumptionBaseDto extends OmitType(DailyConsumptionDto, [
  'id',
  'estimated_consumption',
]) {}
