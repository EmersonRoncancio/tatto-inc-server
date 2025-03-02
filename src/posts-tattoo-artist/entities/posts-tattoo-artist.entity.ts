import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class Image {
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
export class PostsTattooArtist extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'TattooArtist',
    required: true,
  })
  TattooArtist: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: [Image],
    required: true,
  })
  images: Image[];

  @Prop({
    type: [String],
  })
  likes: string[];

  @Prop({
    type: Number,
    default: 0,
  })
  countLikes: number;
}

export const PostsTattooArtistSchema =
  SchemaFactory.createForClass(PostsTattooArtist);
