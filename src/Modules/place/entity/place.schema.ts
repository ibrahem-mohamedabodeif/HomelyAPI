import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Photo } from 'src/Core/types/photo.type';
import { Facility } from 'src/Modules/facelities/entity/facility.schema';
import { PlaceType } from 'src/Modules/place-type/entity/placeType.schema';

@Schema({ timestamps: true })
export class Place {
  @Prop({ required: true, lowercase: true, trim: true })
  title: string;

  @Prop({ required: true, lowercase: true, trim: true })
  description: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlaceType',
  })
  placeTypeID: PlaceType;

  @Prop({
    required: true,
    type: [Number, Number],
    validate: {
      validator: (arr: [number, number]) => arr.length === 2,
      message: 'Location must have [longitude, latitude]',
    },
  })
  location: [number, number];

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  guests: number;

  @Prop({ required: true })
  bedrooms: number;

  @Prop({ required: true })
  beds: number;

  @Prop({ required: true })
  bathrooms: number;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Facility' }],
  })
  facilities: Facility[];

  @Prop({
    required: true,
    type: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    _id: false,
  })
  photos: Photo[];

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  hostID: mongoose.Schema.Types.ObjectId;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
export type PlaceDocument = HydratedDocument<Place>;
