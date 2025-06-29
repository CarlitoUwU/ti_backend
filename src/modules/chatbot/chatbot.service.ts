import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ChatBotMessageDto } from './dto/chatbot.dto';

// Guardar contexto simple por usuario
const conversationContexts = new Map<string, any>();

@Injectable()
export class ChatbotService {
  constructor(private readonly httpService: HttpService) {}

  async respondToMessage(chatbotMessage: ChatBotMessageDto): Promise<any> {
    console.log('recibido a las:', new Date().toISOString());

    // Mensaje inicial del sistema si es la primera vez
    const systemPrompt = `Eres un asistente experto en ahorro de energía eléctrica en hogares del Perú.Respondes SIEMPRE en español. Piensas, razonas y respondes en español, sin usar otros idiomas.No pienses mucho y responde rápido.Tus respuestas deben ser prácticas, claras, breves y útiles para familias peruanas sin conocimientos técnicos. Adapta siempre tu lenguaje al estilo de vida local. Evita tecnicismos y explicaciones extensas.Si el usuario pregunta algo que no tenga relación con el ahorro de energía, redirige cortésmente la conversación hacia ese tema.Recuerda responder rápidamente, como si fueras un experto en ahorro de energía, y no te extiendas demasiado en tus respuestas.`;

    // Obtener contexto previo (si existe)
    const previousContext = conversationContexts.get(chatbotMessage.user_id);

    try {
      const response$ = this.httpService.post(
        'http://localhost:11434/api/generate',
        {
          model: 'deepseek-r1:8b',
          prompt: previousContext
            ? chatbotMessage.message
            : `${systemPrompt}\nUsuario: ${chatbotMessage.message}`,
          stream: false,
          context: previousContext ?? undefined,
          options: {
            temperature: 0.7,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('recibiendo respuesta del chatbot a las:', new Date().toISOString());

      const { data } = await firstValueFrom(response$);

      // Guardar el nuevo contexto para el usuario
      conversationContexts.set(chatbotMessage.user_id, data.context);

      console.log('Respuesta del chatbot:', data.response);

      // Limpiar la respuesta de etiquetas <think> y espacios innecesarios
      const cleanResponse = data.response.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      console.log('listo para enviar respuesta a las:', new Date().toISOString());

      return {
        text: cleanResponse,
      };
    } catch (error) {
      console.error('Error comunicándose con el chatbot:', error.message);
      throw error;
    }
  }
}
