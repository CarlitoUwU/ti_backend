import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { VideoBaseDto } from '.';

export class ActivateVideoDto extends VideoBaseDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the video is active',
    example: true,
    default: true,
  })
  is_active: boolean = true;
}

export class DesactivateVideoDto extends VideoBaseDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the video is active',
    example: false,
    default: false,
  })
  is_active: boolean = false;
}
