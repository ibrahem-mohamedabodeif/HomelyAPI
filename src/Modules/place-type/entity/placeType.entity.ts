import { Expose, Transform } from 'class-transformer';
import { PlaceTypeDocument } from './placeType.schema';

export class PlaceTypeEntity {
  @Expose()
  @Transform(({ obj }: { obj: PlaceTypeDocument }) => obj._id.toString())
  public id: string;
  @Expose()
  public type: string;
  @Expose()
  public icon: string | null;
}
