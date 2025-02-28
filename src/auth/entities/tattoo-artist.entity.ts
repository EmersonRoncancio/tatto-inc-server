import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class TattooArtist extends Document {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  specialty: string;

  @Prop({
    type: String,
    required: true,
  })
  expereince: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
  })
  instagram: string;

  @Prop({
    type: String,
  })
  facebook: string;

  @Prop({
    type: String,
  })
  twitter: string;

  @Prop({
    type: String,
  })
  tiktok: string;

  @Prop({
    type: String,
  })
  address: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isVerified: boolean;
}

export const TattooArtistSchema = SchemaFactory.createForClass(TattooArtist);
