import { Injectable } from '@nestjs/common';
import { ChatBot } from 'src/configs/chatbot.configs';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment } from './entities/appointment.entity';
import { Model, Types } from 'mongoose';
import { TattooArtist } from 'src/auth/entities/tattoo-artist.entity';
import { ConversationFlow } from './entities/conversationFlow.entity';
import { AppointmentResponse } from './types/appointment.type';
import { GetTattooArtistType, GetUserType } from './types/get-user.type';
import { MailService } from 'src/configs/mailer.configs';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<Appointment>,
    @InjectModel(TattooArtist.name)
    private tattooArtistModel: Model<TattooArtist>,
    @InjectModel(ConversationFlow.name)
    private conversationFlowModel: Model<ConversationFlow>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async scheduleAppointment(
    idTattoArtist: string,
    user: GetUserType,
    createAppointmentDto: CreateAppointmentDto,
  ) {
    const tattooArtist = await this.tattooArtistModel.findById(idTattoArtist);
    if (!tattooArtist) {
      throw new Error('Tattoo artist not found');
    }
    const appointments = await this.appointmentModel.find({
      idArtist: new Types.ObjectId(idTattoArtist),
    });
    const conversationFlow = await this.conversationFlowModel.findOne({
      tattooArtist: new Types.ObjectId(idTattoArtist),
      user: new Types.ObjectId(user.user._id as string),
    });

    const chat = new ChatBot();

    const appointment = await chat.scheduleAppointment(
      user.user,
      createAppointmentDto.message,
      appointments,
      tattooArtist,
      conversationFlow!,
    );

    const parseData = appointment.choices[0].message.content;
    let data: AppointmentResponse = {
      message: '',
      color: '',
      date: '',
      status: 'unscheduled appointment',
    };
    if (typeof parseData === 'string') {
      data = JSON.parse(parseData) as AppointmentResponse;
    }

    await this.conversationFlowModel.findOneAndUpdate(
      {
        tattooArtist: new Types.ObjectId(idTattoArtist),
        user: new Types.ObjectId(user.user._id as string),
      },
      {
        $push: {
          message: {
            $each: [
              {
                message: createAppointmentDto.message,
                role: 'user',
              },
              {
                message: data.message,
                role: 'assistant',
              },
            ],
          },
        },
      },
      { new: true, upsert: true },
    );

    if (data.status === 'unscheduled appointment') {
      return {
        message: data.message,
      };
    }

    if (data.date !== 'date not found') {
      const parts = data.date.split(' ');
      const [year, month, day] = parts[0].split('-').map(Number);

      let hours = 0,
        minutes = 0,
        seconds = 0;
      if (parts[1]) {
        [hours, minutes, seconds] = parts[1].split(':').map(Number);
      }

      // Crear la fecha EXACTA en UTC
      const endDate = new Date(
        Date.UTC(year, month - 1, day, hours, minutes, seconds),
      );

      const appointmentExist = await this.appointmentModel.find({
        idArtist: new Types.ObjectId(idTattoArtist),
        date: endDate,
      });

      let validate: boolean = false;
      appointmentExist.forEach((appointment) => {
        if (appointment.date.toISOString() === endDate.toISOString()) {
          validate = true;
        }
      });
      if (validate) {
        return {
          message: data.message,
        };
      }

      await this.appointmentModel.create({
        idArtist: new Types.ObjectId(idTattoArtist),
        idUser: new Types.ObjectId(user.user._id as string),
        title: user.user.name,
        date: endDate,
        color: data.color,
      });

      const Mail = new MailService();

      await Mail.sendAppointmentConfirmation(
        user.user,
        tattooArtist.name,
        endDate.toISOString(),
      );

      await Mail.sendTattooArtistNotification(
        tattooArtist,
        user.user,
        endDate.toISOString(),
      );
    }

    return {
      message: data.message,
    };
  }

  getScheduleArtist(user: GetTattooArtistType) {
    return this.appointmentModel.find({
      idArtist: new Types.ObjectId(user.user._id as string),
    });
  }

  async getScheduleUser(user: GetUserType) {
    const appointments = await this.appointmentModel
      .find({
        idUser: new Types.ObjectId(user.user._id as string),
      })
      .populate('idArtist');

    return appointments;
  }

  async deleteAppointment(idShedule: string) {
    const appointment = await this.appointmentModel.findOneAndDelete(
      { _id: new Types.ObjectId(idShedule) },
      { new: true }, // No es necesario aquí, pero lo dejo como referencia
    );

    await this.conversationFlowModel.deleteOne({
      tattooArtist: new Types.ObjectId(appointment?.idArtist),
      user: new Types.ObjectId(appointment?.idUser),
    });

    const tattooArtist = await this.tattooArtistModel.findById(
      appointment?.idArtist,
    );
    const user = await this.userModel.findById(appointment?.idUser);
    const Mail = new MailService();
    if (tattooArtist && user) {
      await Mail.sendTattooArtistCancellationNotification(
        tattooArtist,
        user,
        appointment?.date.toISOString() as string,
      );
    }

    return {
      message: 'Appointment deleted',
    };
  }
}
