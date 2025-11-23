import { CreatePlaceDto } from '../dto/createPlace.dto';
import { UpdatePlaceDto } from '../dto/updatePlace.dto';
import { Place } from '../entity/place.schema';

export interface IPlaceRepository {
  createPlace(placeData: CreatePlaceDto): Promise<Place>;
  getPlaceById(placeId: string): Promise<Place | null>;
  updatePlace(
    placeId: string,
    updateData: UpdatePlaceDto,
  ): Promise<Place | null>;
  deletePlace(placeId: string): Promise<boolean>;
  listPlaces(filter?: any): Promise<Place[]>;
  getPlacesByHostId(hostId: string, placeId: string): Promise<Place | null>;
}

export const IPlaceRepositoryToken = 'IPlaceRepositoryToken';
