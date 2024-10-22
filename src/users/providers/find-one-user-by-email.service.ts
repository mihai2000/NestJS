import { Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneUserByEmailService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository:Repository<UserEntity>
    ){
    }
    public async findOneByEmail(email:string){
        let user:UserEntity | undefined =  undefined;
        
        try {
            // will return null if user is not found
            user  = await this.usersRepository.findOneBy({
                email:email,
            });
        } catch (error) {
            throw new RequestTimeoutException(error,{
                description:'Could not fetch the user',
            })
        }

        if(!user){
            throw new UnauthorizedException('User does not exist')
        }
        return user;
    }
}
