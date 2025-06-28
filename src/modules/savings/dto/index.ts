import { OmitType } from "@nestjs/swagger";
import { SavingDto } from "./saving.dto";

export class SavingBaseDto extends OmitType(SavingDto, ['id', 'savings_kwh', 'savings_sol']) { }
