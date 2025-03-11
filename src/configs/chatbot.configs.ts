import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { envs } from './envs.configs';
import { User } from 'src/auth/entities/user.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { TattooArtist } from 'src/auth/entities/tattoo-artist.entity';
import { ConversationFlow } from 'src/appointment/entities/conversationFlow.entity';

@Injectable()
export class ChatBot {
  async scheduleAppointment(
    user: User,
    messageUser: string,
    agendaTatuador: Appointment[],
    tattooArtist: TattooArtist,
    conversationFlow: ConversationFlow,
  ) {
    const prompt = `
      Eres un asistente virtual amigable y profesional que ayuda a los usuarios a agendar citas con tatuadores.  
      Tu objetivo es **guiar la conversación paso a paso hasta obtener una fecha y hora clara** para la cita.  

      📌 **Flujo de la conversación**:  
      Aquí tienes el historial de mensajes para asegurarte de seguir la conversación sin desviarte:  
      ${conversationFlow ? JSON.stringify(conversationFlow.message) : '[]'}.  

      📆 **Reglas para agendar la cita**:1 **Extraer fecha y hora**:  
         - Durante la conversación, **debes identificar una fecha y hora exactas** proporcionadas por el usuario.  
         - Si no encuentras una fecha y hora válidas en la conversación, usa \`"date": "date not found"\`.
         - Si solo proporcionan la fecha, no agendes una cita, espera que te proporcione la hora.
         - Hasta que no le confirme la fecha y hora, no agendes la cita, osea en el "data" pon "date not found".

      2 **Disponibilidad del tatuador**:  
         - Usa la agenda del tatuador (${JSON.stringify(agendaTatuador)}) para verificar los horarios disponibles.  
         - Si el array de disponibilidad está vacío, significa que no hay citas agendadas aún.  
         - **Regla de bloqueos**: Cada cita ocupa **dos horas**. Ejemplo: si hay una cita a las 08:00, el horario de 08:00 a 10:00 estará bloqueado, y la próxima disponibilidad será a partir de las 10:00.  

      3 **Interacción con el usuario**:  
         - El usuario se llama **${user.name}** y el tatuador se llama **${tattooArtist.name}**.  
         - Si el usuario elige un horario no disponible, sugiérele opciones alternativas dentro del horario del tatuador.  
         - Mantén un tono siempre **amable y profesional**.  
         - Todas las respuestas deben incluir "message": "<tu respuesta aquí>" para mantener el flujo de la conversación.  

      ⚠️ **Importante**:
      - **No reinicies la conversación a menos que sea estrictamente necesario**.  
      - **Si la conversación ya registra una cita agendada, no modifiques la fecha y hora**.  
      - Continúa guiando al usuario hasta que haya proporcionado **una fecha y hora definitivas**.  
      - RECUERDA QUE SI HAY UNA CITA AGENDADA, LAS SIGUIENTES CITAS DEBEN SER DOS HORAS DESPUÉS DE LA ANTERIOR.

      ¡Tu objetivo es asegurarte de que el usuario pueda concretar su cita de manera eficiente!  
    `;

    const openai = this.apiConection();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: messageUser,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'event_schema',
          schema: {
            type: 'object',
            properties: {
              date: {
                description:
                  "The date of the appointment in YYYY-MM-DD HH:mm:ss format or 'date not found' if not found. If the user does not specify a time, keep 'date': 'date not found'",
                type: 'string',
                format: 'date',
              },
              color: {
                description:
                  "The color of the appoinment, extracted from the input or randomly chosen from ['#bfdbfe', '#bbf7d0', '#fef9c3', '#fecaca', '#e9d5ff', '#eeeeee']",
                type: 'string',
                format: 'hex',
              },
              message: {
                description: 'The message to return to the user',
                type: 'string',
              },
            },
            required: ['title', 'date', 'color'],
            additionalProperties: false,
          },
        },
      },
      store: true,
    });

    return completion;
  }

  private apiConection() {
    const openai = new OpenAI({
      apiKey: envs.OPENIA_API_KEY,
    });

    return openai;
  }
}
