import { Module , forwardRef} from '@nestjs/common';
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
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';

@Module({
controllers:[UsersController],
providers:[UsersService, UsersCreateManyProvider, CreateUserService, FindOneUserByEmailService],
exports:[UsersService],
imports:
    [
        TypeOrmModule.forFeature([UserEntity]),
        forwardRef(() => AuthModule),
        ConfigModule.forFeature(profileConfig),
    ],
})
export class UsersModule {}
