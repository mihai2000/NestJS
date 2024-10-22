import { BadRequestException, forwardRef, Injectable, RequestTimeoutException, Inject } from '@nestjs/common';
import { CreateUserDTO } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/providers/hashing.service';

@Injectable()
export class CreateUserService {
    constructor(
        /*
        * Injecting usersRepository
        */ 
        @InjectRepository(UserEntity)
        private readonly usersRepository:Repository<UserEntity>,

        /*
        * Injecting hashingService
        */ 
        @Inject(forwardRef(()=>HashingService))
        private readonly hashingService:HashingService
    ){}

    public async createUser(createUserDTO:CreateUserDTO){
        // check if users exists with the same email
       let existingUser = undefined;
        try {
         existingUser = await this.usersRepository.findOne({
            where:{email:createUserDTO.email}
            });
       } catch (error) {
        throw new RequestTimeoutException('Unable to porocess your req at the moment, try later', {
            description:"Error connecting to the database",
        })
       }
        // handle exceptions
        if(existingUser){
            throw new BadRequestException("The User already exists, please check ypur email");
        }
        // if user doesn't exist create a user
        let newUser = this.usersRepository.create({
            ... createUserDTO,
            password:await this.hashingService.hashPassword(createUserDTO.password)
        });

        try {
            newUser = await this.usersRepository.save(newUser);
        } catch (error) {
            throw new RequestTimeoutException('Unable to porocess your req at the moment, try later', {
                description:"Error connecting to the database",
            })
        }
        return newUser;
    }
}
