import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { envs } from './envs.configs';
import { User } from 'src/auth/entities/user.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';

const colores = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#F1C40F',
  '#8E44AD',
  '#E74C3C',
  '#2ECC71',
  '#3498DB',
  '#1ABC9C',
  '#D35400',
];

@Injectable()
export class ChatBot {
  async scheduleAppointment(
    user: User,
    messageUser: string,
    agendaTatuador: Appointment[],
  ) {
    const prompt = `
    Actúa como un asistente virtual amigable y profesional que ayuda a los usuarios a agendar citas con tatuadores. 
    El usuario te dará información en lenguaje natural sobre la fecha y hora en la que desea agendar su cita. 
    
    - Dirígete siempre al usuario llamándolo "${user.name}".  
    - Extrae la fecha y la hora desde el mensaje del usuario.  
    - Verifica si esa fecha y hora están disponibles en la agenda proporcionada.  
    - Si la fecha está libre, confirma la cita de manera amigable y entusiasta.  
    - Si está ocupada, sugiere una alternativa cercana sin decir directamente que está reservada.  
    - Usa un tono cálido, cercano y profesional.  

    **IMPORTANTE:** Devuelve la respuesta en formato JSON con esta estructura:  

    {
      "date": "aaaa/mm/dd hh:mm",
      "color": "uno de los siguientes colores: ${JSON.stringify(colores)}",
      "title": "nombre del cliente"
    }

    Agenda ocupada del tatuador: ${JSON.stringify(agendaTatuador)}

    Mensaje del usuario: "${messageUser}"
  `;

    const openai = this.apiConection();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      store: true,
      messages: [{ role: 'system', content: prompt }],
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
