import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Appointment {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  })
  idUser: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'TattooArtist',
  })
  idArtist: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: Date,
    required: true,
  })
  date: Date;

  @Prop({
    type: String,
    required: true,
  })
  color: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
