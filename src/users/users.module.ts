import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserEntity } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersCreateManyProvider } from './providers/users-create-many.provider';
import { CreateUserService } from './providers/create-user.service';
import { FindOneUserByEmailService } from './providers/find-one-user-by-email.service';
import profileConfig from './config/profile.config';
import { FindOneByGoogleIdService } from './providers/find-one-by-google-id.service';
import { CreateGoogleUserService } from './providers/create-google-user.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersCreateManyProvider,
    CreateUserService,
    FindOneUserByEmailService,
    FindOneByGoogleIdService,
    CreateGoogleUserService,
  ],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule),
    ConfigModule.forFeature(profileConfig),
  ],
})
export class UsersModule {}
