import { Expose } from 'class-transformer';

export class Photo {
  @Expose()
  url: string;
  @Expose()
  public_id: string;
}
