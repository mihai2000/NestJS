import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDTO } from '../dto/get-users-param.dto';
import { UserEntity } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { createManyUsersDto } from '../dto/create-many-users.dto';
import { CreateUserService } from './create-user.service';
import { FindOneUserByEmailService } from './find-one-user-by-email.service';
import { FindOneByGoogleIdService } from './find-one-by-google-id.service';
import { CreateGoogleUserService } from './create-google-user.service';
import { GoogleUser } from '../interfaces/google-user.interface';

/**
 *  Class to connect  to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  /**
   * The method ot get all the users from the database
   */
  // constructor(

  constructor(
    /*
     * Injecting usersRepository
     */
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,

    /*
     * Injecting usersCreateManyProvider
     */
    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    /*
         Inject createUserService
        */
    private readonly createUserService: CreateUserService,
    /*
         Inject findOneUserByEmailService
        */
    private readonly findOneUserByEmailService: FindOneUserByEmailService,

    private readonly findOneByGoogleIdService: FindOneByGoogleIdService,

    private readonly createGoogleUserServcice: CreateGoogleUserService,
  ) {}

  public async createUser(createUserDTO: CreateUserDTO) {
    return this.createUserService.createUser(createUserDTO);
  }

  public findAll(
    getUsersParamDTO: GetUsersParamDTO,
    limit: number,
    page: number,
  ) {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API endpoint does not exist',
        fileName: 'user.service.ts',
        lineNumber: 78,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: 'Occured because the api was permanently moved',
      },
    );
  }

  /**
   *Finding a single user by the id
   */
  public async findOneById(id: number) {
    let user = undefined;

    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to porocess your req at the moment, try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    // user does not exist exception
    if (!user) {
      throw new BadRequestException('the user id does not exist');
    }
    return await this.usersRepository.findOneBy({ id });
  }

  public async createMany(createManyUsersDto: createManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }

  public async findOneByEmail(email: string) {
    return this.findOneUserByEmailService.findOneByEmail(email);
  }

  public async findOneByGoogleId(googleId: string) {
    return await this.findOneByGoogleIdService.findOneByGoogleId(googleId);
  }

  public async createGoogleUser(googleUser: GoogleUser) {
    return await this.createGoogleUserServcice.createGoogleUser(googleUser);
  }
}
