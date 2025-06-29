import { OmitType } from '@nestjs/swagger';
import { MedalDto } from './medal.dto';

export class MedalBaseDto extends OmitType(MedalDto, []) {}
