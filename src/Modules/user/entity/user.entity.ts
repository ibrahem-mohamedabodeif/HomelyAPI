import { Expose, Transform } from 'class-transformer';
import { userDocument } from './user.schema';

export class UserEntity {
  @Expose()
  @Transform(({ obj }: { obj: userDocument }) => obj._id.toString())
  id: string;

  @Expose()
  user_name: string;

  @Expose()
  email: string;

  @Expose()
  password: string;

  @Expose()
  role: string;
}
