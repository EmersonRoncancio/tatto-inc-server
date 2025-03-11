import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { ChatBot } from 'src/configs/chatbot.configs';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment } from './entities/appointment.entity';
import { Model } from 'mongoose';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<Appointment>,
  ) {}

  async scheduleAppointment(
    idTattoArtist: string,
    user: User,
    createAppointmentDto: CreateAppointmentDto,
  ) {
    const appointments = await this.appointmentModel.find({
      idArtist: idTattoArtist,
    });

    const chat = new ChatBot();
    const appointment = await chat.scheduleAppointment(
      user,
      createAppointmentDto.message,
      appointments,
    );

    console.log(appointment);
  }
}
