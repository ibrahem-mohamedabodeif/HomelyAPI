import { Injectable } from '@nestjs/common';
import { CreatePlaceTypeDto } from '../dto/createPlaceType.dto';
import { UpdatePlaceTypeDto } from './../dto/updatePlaceType.dto';
import { IPlaceTypeRepository } from './placeType.interface';
import { PlaceType } from './../entity/placeType.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlaceTypeRepository implements IPlaceTypeRepository {
  constructor(
    @InjectModel(PlaceType.name)
    private Model: Model<PlaceType>,
  ) {}
  async create(type: CreatePlaceTypeDto): Promise<PlaceType> {
    return await this.Model.create(type);
  }
  async update(
    id: string,
    type: UpdatePlaceTypeDto,
  ): Promise<PlaceType | null> {
    return await this.Model.findByIdAndUpdate(id, type, {
      new: true,
    });
  }
  async getAll(): Promise<PlaceType[]> {
    return await this.Model.find();
  }

  async getById(id: string): Promise<PlaceType | null> {
    return await this.Model.findById(id);
  }
  async getByType(type: string): Promise<PlaceType | null> {
    return await this.Model.findOne({ type });
  }
  async delete(id: string): Promise<boolean> {
    const placeType = await this.Model.findByIdAndDelete(id);
    return !!placeType;
  }
}
