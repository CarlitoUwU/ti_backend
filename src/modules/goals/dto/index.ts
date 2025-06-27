import { OmitType } from "@nestjs/swagger";
import { GoalDto } from "./goal.dto";

export class GoalBaseDto extends OmitType(GoalDto, ['id', 'estimated_cost']) { }
