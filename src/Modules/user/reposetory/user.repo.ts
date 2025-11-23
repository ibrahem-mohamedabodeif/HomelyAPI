import { SignupDto } from 'src/Modules/auth/dto/signup.dto';
import { UserInterface } from './user.interface';
import { user } from './../entity/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class UserRepository implements UserInterface {
  constructor(@InjectModel(user.name) private userModel: Model<user>) {}
  async create(user: SignupDto): Promise<user> {
    return await this.userModel.create(user);
  }
  async findByEmail(email: string): Promise<user | null> {
    return await this.userModel.findOne({ email }).select('+password');
  }
  async findById(id: string): Promise<user | null> {
    return await this.userModel.findById(id).select('+password');
  }
}
