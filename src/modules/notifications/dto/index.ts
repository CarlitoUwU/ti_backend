import { OmitType } from "@nestjs/swagger";
import { NotificationDto } from "./notification.dto";

export class NotificationBaseDto extends OmitType(NotificationDto, []) { }
