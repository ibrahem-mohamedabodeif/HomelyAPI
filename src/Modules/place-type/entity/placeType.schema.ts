import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class PlaceType {
  @Prop({
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  })
  type: string;

  @Prop({
    trim: true,
  })
  icon: string;
}

export const PlaceTypeSchema = SchemaFactory.createForClass(PlaceType);

export type PlaceTypeDocument = HydratedDocument<PlaceType>;
