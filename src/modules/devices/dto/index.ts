import { OmitType } from "@nestjs/swagger";
import { DeviceDto } from "./device.dto";

export class DeviceBaseDto extends OmitType(DeviceDto, []) { }
