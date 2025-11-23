import { CreatePlaceTypeDto } from '../dto/createPlaceType.dto';
import { UpdatePlaceTypeDto } from './../dto/updatePlaceType.dto';
import { PlaceType } from './../entity/placeType.schema';

export interface IPlaceTypeRepository {
  create(type: CreatePlaceTypeDto): Promise<PlaceType>;
  update(id: string, type: UpdatePlaceTypeDto): Promise<PlaceType | null>;
  getAll(): Promise<PlaceType[]>;
  getById(id: string): Promise<PlaceType | null>;
  getByType(type: string): Promise<PlaceType | null>;
  delete(id: string): Promise<boolean>;
}

export const IPlaceTypeRepositoryToken = 'IPlaceTypeRepository';
