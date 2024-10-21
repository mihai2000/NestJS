import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UserEntity } from '../user.entity';
import { DataSource } from 'typeorm';
import { createManyUsersDto } from '../dto/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
    constructor(
        /*
        Inject dataSource
        */
        private readonly dataSource:DataSource
        
    ){}
     // Create Transactions
     public async createMany(createManyUsersDto:createManyUsersDto){
        let newUsers: UserEntity[] = [];
        // Create  Query Runner instance
        const queryRunner =  this.dataSource.createQueryRunner();
        try {
            // Connect Query Runner to datasource
            await queryRunner.connect();
            await queryRunner.startTransaction();
        } catch (error) {
            throw new RequestTimeoutException('Could not connect to the database');
        }
        // Start Transaction
        try {
            // for loop to create new users
            for(let user of createManyUsersDto.users){
                // put where to create the new user (UserEntity), and what user object it need to be created (user)
                let newUser = queryRunner.manager.create(UserEntity,user);
                let result =await queryRunner.manager.save(newUser);
                newUsers.push(result);
            }
            // If successful then commit
            await queryRunner.commitTransaction();
        } catch (error) {
            // If unsuccessful then rollback
            await queryRunner.rollbackTransaction();
            throw new ConflictException('Could not complete the transaction',{
                description:String(error)
            })
        } finally{
            // finally will always run no matter what
            // Release connection
            try {
                await queryRunner.release();
            } catch (error) {
                throw new RequestTimeoutException('Could not release the connection',{
                    description:String(error)
                })
            }
        }
        return newUsers
    }
}
