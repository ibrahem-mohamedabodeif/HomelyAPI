import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/Core/types/role.enum';

@Schema({ timestamps: true })
export class user {
  @Prop({ required: true })
  user_name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false, minlength: 8 })
  password: string;

  @Prop({ default: Role.Client, enum: Role })
  role: string;
}

export type userDocument = HydratedDocument<user>;

export const UserSchema = SchemaFactory.createForClass(user);
