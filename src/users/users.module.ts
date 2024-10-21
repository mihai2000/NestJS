import { Module , forwardRef} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserEntity } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersCreateManyProvider } from './providers/users-create-many.provider';
import profileConfig from 'src/config/profile.config';

@Module({
controllers:[UsersController],
providers:[UsersService, UsersCreateManyProvider],
exports:[UsersService],
imports: [TypeOrmModule.forFeature([UserEntity]),
forwardRef(() => AuthModule),
ConfigModule.forFeature(profileConfig)],
})
export class UsersModule {}
