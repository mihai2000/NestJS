import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GetUsersParamDTO } from "../dto/get-users-param.dto";
import { UserEntity } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDTO } from "../dto/create-user.dto";
import { AuthService } from "src/auth/providers/auth.service";
import { ConfigService, ConfigType } from "@nestjs/config";
import profileConfig from "src/config/profile.config";

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
        /**
         * Injecting usersRepository
         */ 
          @InjectRepository(UserEntity)
          private usersRepository:Repository<UserEntity>,

          // Injecting Auth Service
          @Inject(forwardRef(()=>AuthService))
          private readonly authService:AuthService,

        //   have acces to profile api key
          @Inject(profileConfig.KEY)
          private readonly profileConfiguration:ConfigType<typeof profileConfig>

        ){}

    public async createUser(createUserDTO:CreateUserDTO){
        // check if users exists with the same email
        const existingUser = await this.usersRepository.findOne({
        where:{email:createUserDTO.email}
        });
        // handle exceptions
        // if user doesn't exist create a user
        let newUser = this.usersRepository.create(createUserDTO);
        newUser = await this.usersRepository.save(newUser);
        return newUser;
    }


    public findAll(
        getUsersParamDTO:GetUsersParamDTO,
        limit:number,
        page:number
    ){
    console.log(this.profileConfiguration);
        return [
            {
            firstName:"John",
            email:"john@doe.com"
            },
            {
            firstName:"Alice",
            email:"alice@doe.com"
            }
        ]
    }

    /** 
     *Finding a single user by the id
    */
    public async findOneById(id:number){
       return await this.usersRepository.findOneBy({id});
    }
}