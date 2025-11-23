import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Facility {
  @Prop({ unique: true, required: true, lowercase: true, trim: true })
  title: string;

  @Prop({ trim: true })
  icon: string;
}

export const FacilitySchema = SchemaFactory.createForClass(Facility);
export type FacilityDocument = HydratedDocument<Facility>;
