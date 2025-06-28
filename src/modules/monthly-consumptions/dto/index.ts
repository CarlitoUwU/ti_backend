import { OmitType } from "@nestjs/swagger";
import { MonthlyConsumptionDto } from "./monthly-consumption.dto";

export class MonthlyConsumptionBaseDto extends OmitType(MonthlyConsumptionDto, ['id', 'kwh_total', 'kwh_cost', 'amount_paid']) { }
