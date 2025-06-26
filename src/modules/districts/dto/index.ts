import { OmitType } from "@nestjs/swagger";
import { DistrictDto } from "./district.dto";

export class DistrictBaseDto extends OmitType(DistrictDto, []) { }