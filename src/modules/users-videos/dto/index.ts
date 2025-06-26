import { OmitType } from "@nestjs/swagger";
import { UserVideoDto } from "./user-video.dto";

export class UserVideoBaseDto extends OmitType(UserVideoDto, []) { }
