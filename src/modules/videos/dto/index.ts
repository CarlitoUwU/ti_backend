import { OmitType } from "@nestjs/swagger";
import { VideoDto } from "./video.dto";

export class VideoBaseDto extends OmitType(VideoDto, []) { }
