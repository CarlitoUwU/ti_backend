import { OmitType } from "@nestjs/swagger";
import { UserMedalDto } from "./user-medal.dto";

export class UserMedalBaseDto extends OmitType(UserMedalDto, []) { }
