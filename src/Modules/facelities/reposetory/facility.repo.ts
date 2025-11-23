import { Injectable } from '@nestjs/common';
import { IFacilityRepository } from './placeType.interface';
import { createFacilityDto } from './../dto/createFacility.dto';
import { updateFacilityDto } from './../dto/updateFacility.dto';
import { Facility } from './../entity/facility.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FacilityRepository implements IFacilityRepository {
  constructor(
    @InjectModel(Facility.name)
    private readonly facilityModel: Model<Facility>,
  ) {}
  async create(facilityData: createFacilityDto): Promise<Facility> {
    return this.facilityModel.create(facilityData);
  }
  async update(
    id: string,
    facilityData: updateFacilityDto,
  ): Promise<Facility | null> {
    return this.facilityModel.findByIdAndUpdate(id, facilityData, {
      new: true,
    });
  }

  async delete(id: string): Promise<boolean> {
    const facility = await this.facilityModel.findByIdAndDelete(id);
    return !!facility;
  }

  async getAll(): Promise<Facility[]> {
    return this.facilityModel.find();
  }

  async getById(id: string): Promise<Facility | null> {
    return this.facilityModel.findById(id);
  }
  async getByTitle(title: string): Promise<Facility | null> {
    return this.facilityModel.findOne({ title });
  }
}
