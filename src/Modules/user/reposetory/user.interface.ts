import { SignupDto } from 'src/Modules/auth/dto/signup.dto';
import { user } from './../entity/user.schema';

export interface UserInterface {
  create(user: SignupDto): Promise<user>;
  findByEmail(email: string): Promise<user | null>;
  findById(id: string): Promise<user | null>;
}

export const IUserRepositoryToken = 'IUserRepositoryToken';
