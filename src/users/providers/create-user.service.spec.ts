import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserService } from './create-user.service';
import { DataSource, Repository } from 'typeorm';
import { HashingService } from 'src/auth/providers/hashing.service';
import { MailService } from 'src/mail/providers/mail.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity';
import { resolve } from 'path';
import { BadRequestException } from '@nestjs/common';


type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
})


describe('CreateUsersService', () => {
    let provider: CreateUserService;
    let usersRepository: MockRepository;
    let user = {
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.com",
        password: "password"
    }
    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [CreateUserService,
                { provide: DataSource, useValue: {} },
                { provide: getRepositoryToken(UserEntity), useValue: createMockRepository() },
                { provide: HashingService, useValue: { hashPassword: jest.fn(() => user.password) } },
                { provide: MailService, useValue: { sendUserWelcome: jest.fn(() => Promise.resolve()) } },
            ]
        }).compile();


        provider = module.get<CreateUserService>(CreateUserService)
        usersRepository = module.get(getRepositoryToken(UserEntity));
    });

    it('Should be defined!"', () => {
        expect(provider).toBeDefined();
    });


    describe('createUser', () => {
        describe('when user does not exist in DB', () => {
            it('should create new user', async () => {
                usersRepository.findOne.mockReturnValue(null);
                usersRepository.create.mockReturnValue(user);
                usersRepository.save.mockReturnValue(user);
                const newUser = await provider.createUser(user);
                expect(usersRepository.findOne).toHaveBeenCalledWith({
                    where: { email: user.email }
                });
                expect(usersRepository.create).toHaveBeenCalledWith(user);
                expect(usersRepository.save).toHaveBeenCalledWith(user);
            });
        })
        describe('When the same user exists', () => {
            it('throw an error BadRequestException', async () => {
                usersRepository.findOne.mockReturnValue(user.email);
                usersRepository.create.mockReturnValue(user);
                usersRepository.save.mockReturnValue(user);
                try {
                    const newUser = await provider.createUser(user);
                } catch (error) {
                    expect(error).toBeInstanceOf(BadRequestException)
                }
            });
        })
    })
});
