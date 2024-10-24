import { ConflictException, Injectable } from '@nestjs/common';
import { UserEntity } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleUser } from '../interfaces/google-user.interface';

@Injectable()
export class CreateGoogleUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async createGoogleUser(googleUser: GoogleUser) {
    try {
      const user = this.userRepository.create(googleUser);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Could not create a new user',
      });
    }
  }
}
