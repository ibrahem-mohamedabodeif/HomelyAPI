import { createFacilityDto } from './../dto/createFacility.dto';
import { updateFacilityDto } from './../dto/updateFacility.dto';
import { Facility } from './../entity/facility.schema';

export interface IFacilityRepository {
  create(facilityData: createFacilityDto): Promise<Facility | null>;
  update(id: string, facilityData: updateFacilityDto): Promise<Facility | null>;
  delete(id: string): Promise<boolean>;
  getAll(): Promise<Facility[]>;
  getById(id: string): Promise<Facility | null>;
  getByTitle(title: string): Promise<Facility | null>;
}

export const IFacilityRepositoryToken = 'IFacilityRepository';
