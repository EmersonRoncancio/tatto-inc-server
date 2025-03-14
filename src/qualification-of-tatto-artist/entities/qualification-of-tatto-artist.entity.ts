import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class QualificationOfTattoArtist extends Document {
  @Prop({
    type: Number,
    required: true,
    min: 1,
    max: 5,
  })
  qualification: number;

  @Prop({
    type: String,
    required: false,
  })
  comment: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'TattooArtist',
  })
  tattooArtist: Types.ObjectId;
}

export const QualificationOfTattoArtistSchema = SchemaFactory.createForClass(
  QualificationOfTattoArtist,
);
