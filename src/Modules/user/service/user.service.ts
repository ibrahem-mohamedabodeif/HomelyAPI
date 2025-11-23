import { Inject, Injectable } from '@nestjs/common';
import { SignupDto } from 'src/Modules/auth/dto/signup.dto';
import { UserEntity } from '../entity/user.entity';
import { plainToInstance } from 'class-transformer';
import * as userInterface from '../reposetory/user.interface';
import { AppLogger } from 'src/Core/filters/logger.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(userInterface.IUserRepositoryToken)
    private readonly repo: userInterface.UserInterface,
    private readonly logger: AppLogger,
  ) {}

  async create(userDto: SignupDto): Promise<UserEntity> {
    const user = await this.repo.create(userDto);
    return plainToInstance(UserEntity, user, {
      excludeExtraneousValues: true,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.repo.findByEmail(email);
    return plainToInstance(UserEntity, user, {
      excludeExtraneousValues: true,
    });
  }
  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.repo.findById(id);
    return plainToInstance(UserEntity, user, {
      excludeExtraneousValues: true,
    });
  }
}
