import { Expose, Transform } from 'class-transformer';
import { FacilityDocument } from './facility.schema';

export class FacilityEntity {
  @Expose()
  @Transform(({ obj }: { obj: FacilityDocument }) => obj._id.toString())
  public id: string;
  @Expose()
  public title: string;
  @Expose()
  public icon?: string | null;
}
