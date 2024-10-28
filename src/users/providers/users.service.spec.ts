import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateGoogleUserService } from './create-google-user.service';
import { FindOneByGoogleIdService } from './find-one-by-google-id.service';
import { FindOneUserByEmailService } from './find-one-user-by-email.service';
import { CreateUserService } from './create-user.service';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity';
import { CreateUserDTO } from '../dto/create-user.dto';

describe('UsersService', () => {
    let service: UsersService;
    // nest depends on the dependencies on the constructor
    beforeEach(async () => {
        const mockCreateUserService: Partial<CreateUserService> = {
            createUser: (createUserDTO: CreateUserDTO) => Promise.resolve({
                id: 12,
                firstName: createUserDTO.firstName,
                lastName: createUserDTO.lastName,
                email: createUserDTO.email,
                password: createUserDTO.password
            })
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: CreateUserService, useValue: mockCreateUserService },
                { provide: DataSource, useValue: {} },
                { provide: getRepositoryToken(UserEntity), useValue: {} }, //for importing user repository
                // mocking dependencies
                { provide: CreateGoogleUserService, useValue: {} },
                { provide: FindOneByGoogleIdService, useValue: {} },
                { provide: FindOneUserByEmailService, useValue: {} },
                { provide: UsersCreateManyProvider, useValue: {} }
            ],
        }).compile();
        service = module.get<UsersService>(UsersService)
    });

    it('Should be defined!"', () => {
        expect(service).toBeDefined();
    });



    describe('createUser', () => {
        it('should be defined', () => {
            expect(service.createUser).toBeDefined();
        });
        it('should call create user on createUserService', async () => {
            let user = await service.createUser({
                firstName: "Jon",
                lastName: "MIh",
                email: "jon@mih.com",
                password: "password"
            });
            expect(user.firstName).toEqual('Jon')
        })
    })
});
