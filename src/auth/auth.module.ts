import { Module,forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './providers/auth.service';
import { HashingService } from './providers/hashing.service';
import { BcryptService } from './providers/bcrypt.service';
import { SignInService } from './providers/sign-in.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
@Module({
  controllers: [AuthController],
  providers: [
    AuthService, 
    {
      provide:  HashingService,
      useClass: BcryptService
    }, SignInService
  ],
imports:[
  forwardRef(()=>UsersModule), 
  ConfigModule.forFeature(jwtConfig), 
  JwtModule.registerAsync(jwtConfig.asProvider())
],
  exports:[AuthService, HashingService]
})
export class AuthModule {}
