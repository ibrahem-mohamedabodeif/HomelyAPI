import { Expose, Transform, Type } from 'class-transformer';
import { Photo } from 'src/Core/types/photo.type';
import { FacilityEntity } from 'src/Modules/facelities/entity/facility.entity';
import { PlaceDocument } from './place.schema';
import { PlaceTypeDocument } from 'src/Modules/place-type/entity/placeType.schema';
import { UserEntity } from 'src/Modules/user/entity/user.entity';
import { userDocument } from 'src/Modules/user/entity/user.schema';

export class PlaceEntity {
  @Expose()
  @Transform(({ obj }: { obj: PlaceDocument }) => obj._id.toString())
  public id: string;

  @Expose()
  public title: string;
  @Expose()
  public description: string;

  @Expose()
  @Transform(({ obj }: { obj: PlaceDocument }) => obj.placeTypeID.type)
  public placeType: string;
  @Expose()
  @Transform(({ obj }: { obj: PlaceTypeDocument }) => obj._id.toString())
  public placeTypeID: string;

  @Expose()
  public location: [number, number];
  @Expose()
  public country: string;
  @Expose()
  public city: string;
  @Expose()
  public address: string;

  @Expose()
  public guests: number;
  @Expose()
  public bedrooms: number;
  @Expose()
  public beds: number;
  @Expose()
  public bathrooms: number;

  @Expose()
  @Type(() => FacilityEntity)
  public facilities: FacilityEntity[];

  @Expose()
  public price: number;

  @Expose()
  @Type(() => Photo)
  public photos: Photo[];

  @Expose()
  @Type(() => UserEntity)
  @Transform(({ obj }: { obj: PlaceDocument }) => obj.hostID)
  public host: UserEntity;

  @Expose()
  @Transform(({ obj }: { obj: userDocument }) => obj._id.toString())
  public hostID: string;

  public createdAt: Date;
  public updatedAt: Date;

  public isDeleted: boolean;
  public deletedAt: Date;
}
