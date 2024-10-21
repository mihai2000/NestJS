import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { GetUsersParamDTO } from "../dto/get-users-param.dto";
import { UserEntity } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateUserDTO } from "../dto/create-user.dto";
import { AuthService } from "src/auth/providers/auth.service";
import { ConfigService, ConfigType } from "@nestjs/config";
import profileConfig from "src/config/profile.config";
import { error } from "console";
import { UsersCreateManyProvider } from "./users-create-many.provider";
import { createManyUsersDto } from "../dto/create-many-users.dto";

/**
 *  Class to connect  to Users table and perform business operations
 */ 
@Injectable()
export class UsersService{
    /**
     * The method ot get all the users from the database
     */
    // constructor(


    constructor(
        /*
        * Injecting usersRepository
        */ 
        @InjectRepository(UserEntity)
        private usersRepository:Repository<UserEntity>,

        // Injecting Auth Service
        @Inject(forwardRef(()=>AuthService))
        private readonly authService:AuthService,

        //  have acces to profile api key
        @Inject(profileConfig.KEY)
        private readonly profileConfiguration:ConfigType<typeof profileConfig>,
        /*
        * Injecting usersCreateManyProvider
        */ 
        private readonly usersCreateManyProvider:UsersCreateManyProvider,
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
        let newUser = this.usersRepository.create(createUserDTO);

        try {
            newUser = await this.usersRepository.save(newUser);
        } catch (error) {
            throw new RequestTimeoutException('Unable to porocess your req at the moment, try later', {
                description:"Error connecting to the database",
            })
        }
        return newUser;
    }


    public findAll(
        getUsersParamDTO:GetUsersParamDTO,
        limit:number,
        page:number
    ){
        throw new HttpException({
            status:HttpStatus.MOVED_PERMANENTLY,
            error:"The API endpoint does not exist",
            fileName:"user.service.ts",
            lineNumber:78
        },
    HttpStatus.MOVED_PERMANENTLY,
{
    cause: new Error(),
    description:"Occured because the api was permanently moved"
})
    }

    /** 
     *Finding a single user by the id
    */
    public async findOneById(id:number){
        let user = undefined;

        try {
           user = await this.usersRepository.findOneBy({id});
        } catch (error) {
            throw new RequestTimeoutException('Unable to porocess your req at the moment, try later', {
                description:"Error connecting to the database",
            })
        }

        // user does not exist exception
        if(!user){
            throw new BadRequestException("the user id does not exist");
        }
       return await this.usersRepository.findOneBy({id});
    }

    public async createMany(createManyUsersDto:createManyUsersDto){
      return await this.usersCreateManyProvider.createMany(createManyUsersDto);
    }
}