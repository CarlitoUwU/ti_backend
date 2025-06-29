import { Body, Controller, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatBotMessageDto } from './dto/chatbot.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) { }

  @Post('message')
  @ApiOperation({ summary: 'Send a message to the chatbot' })
  @ApiResponse({
    status: 200,
    description: 'The message has been successfully sent.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async sendMessage(@Body() chatBotMessageDto: ChatBotMessageDto) {
    return this.chatbotService.respondToMessage(chatBotMessageDto);
  }
}
