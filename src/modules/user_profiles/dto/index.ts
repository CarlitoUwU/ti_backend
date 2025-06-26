import { OmitType } from "@nestjs/swagger";
import { UserProfileDto } from "./user_profile.dto";

export class UserProfileBaseDto extends OmitType(UserProfileDto, ['user_id', 'is_active']) { }