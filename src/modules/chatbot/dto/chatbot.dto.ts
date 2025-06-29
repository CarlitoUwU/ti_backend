import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatBotMessageDto {
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  user_id!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Message content for the chatbot',
    example: 'Hello, how can I help you today?',
  })
  message!: string;
}
