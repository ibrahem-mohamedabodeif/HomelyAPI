import { Injectable } from '@nestjs/common';
import { CreatePlaceDto } from './../dto/createPlace.dto';
import { UpdatePlaceDto } from './../dto/updatePlace.dto';
import { IPlaceRepository } from './place.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Place } from '../entity/place.schema';
import { Model } from 'mongoose';

@Injectable()
export class PlaceRepository implements IPlaceRepository {
  constructor(@InjectModel(Place.name) private placeModel: Model<Place>) {}
  async createPlace(placeData: CreatePlaceDto): Promise<Place> {
    const place = await this.placeModel.create(placeData);
    return place;
  }
  async updatePlace(
    placeId: string,
    updateData: UpdatePlaceDto,
  ): Promise<Place | null> {
    return this.placeModel
      .findOneAndUpdate({ _id: placeId, isDeleted: false }, updateData, {
        new: true,
      })
      .populate('placeTypeID')
      .populate('facilities')
      .populate('hostID');
  }

  async deletePlace(placeId: string): Promise<boolean> {
    const result = await this.placeModel.findOneAndUpdate(
      { _id: placeId, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
    );
    return !!result;
  }

  async listPlaces(filter?: Record<string, unknown>): Promise<Place[]> {
    const query = { ...(filter ?? {}), isDeleted: false };
    return this.placeModel
      .find(query)
      .populate('placeTypeID')
      .populate('facilities')
      .populate('hostID');
  }

  async getPlaceById(placeId: string): Promise<Place | null> {
    return this.placeModel
      .findOne({ _id: placeId, isDeleted: false })
      .populate('placeTypeID')
      .populate('facilities')
      .populate('hostID');
  }

  async getPlacesByHostId(
    hostId: string,
    placeId: string,
  ): Promise<Place | null> {
    return this.placeModel
      .findOne({ hostID: hostId, isDeleted: false, _id: { $ne: placeId } })
      .populate('placeTypeID')
      .populate('facilities')
      .populate('hostID');
  }
}
