import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class imagesProfileandBackground extends Document {
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

@Schema()
export class User extends Document {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
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
    type: Date,
    default: Date.now,
  })
  registrationDate: Date;

  @Prop({
    type: Boolean,
    default: false,
  })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
