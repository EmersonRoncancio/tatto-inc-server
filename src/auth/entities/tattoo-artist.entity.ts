import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class imagesProfileandBackground {
  @Prop({
    required: true,
    index: true,
  })
  url: string;

  @Prop({
    index: true,
  })
  public_id: string;
}

@Schema({ _id: false })
class SocialNetworks extends Document {
  @Prop({
    type: String,
    required: true,
  })
  instagram: string;

  @Prop({
    type: String,
    required: true,
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
}

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
  experience: string;

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
    type: imagesProfileandBackground,
  })
  photoPerfil: imagesProfileandBackground;

  @Prop({
    type: imagesProfileandBackground,
  })
  photoBackground: imagesProfileandBackground;

  @Prop({
    type: SocialNetworks,
  })
  socialNetworks: SocialNetworks;

  @Prop({
    type: String,
    required: true,
  })
  address: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: String,
  })
  numberPhone: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isVerified: boolean;

  @Prop({
    type: String,
  })
  schedule: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  authorizedArtist: boolean;
}

export const TattooArtistSchema = SchemaFactory.createForClass(TattooArtist);
