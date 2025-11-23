import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: String, required: true, select: false })
  refreshToken: string;

  @Prop({ type: String, required: true })
  deviceInfo: string;

  @Prop({ type: String, required: true })
  ipAddress: string;

  @Prop({ type: Date, required: true, index: { expires: '0s' } })
  expiredAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

export type SessionDocument = mongoose.HydratedDocument<Session>;
