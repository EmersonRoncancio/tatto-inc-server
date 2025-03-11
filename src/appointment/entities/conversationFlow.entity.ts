import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class Messages {
  @Prop({
    type: String,
    required: true,
  })
  message: string;

  @Prop({
    type: String,
    required: true,
  })
  role: string;
}

@Schema()
export class ConversationFlow {
  @Prop({
    type: [Messages],
    required: true,
  })
  message: Messages[];

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  })
  user: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'TattooArtist',
  })
  tattooArtist: Types.ObjectId;
}

export const ConversationFlowSchema =
  SchemaFactory.createForClass(ConversationFlow);
