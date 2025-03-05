import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Admin {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  user: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;
}

export const AuthAdminSchema = SchemaFactory.createForClass(Admin);
