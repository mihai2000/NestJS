import { forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from '../dto/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingService } from './hashing.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class SignInService {
    constructor(
        @Inject(forwardRef(()=>UsersService))
        private readonly usersService:UsersService,
        
        private readonly hashingService:HashingService,

        private readonly jwtService:JwtService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration:ConfigType<typeof jwtConfig>
    ){}

    public async signIn(signInDto:SignInDto){
        // Find the user using email ID ,Throw an exception if user not found
        // Made in the find-one-user-by-email service , implemened in the users service
        let user = await this.usersService.findOneByEmail(signInDto.email)
        // Compare password to the hash
        let isEqual:boolean = false;
        try {
            isEqual = await this.hashingService.comparePassword(
                signInDto.password,
                user.password
            );
        } catch (error) {
            throw new RequestTimeoutException(error,{
                description:"Could not compare passwords"
            })
        }
        if(!isEqual){
            throw new UnauthorizedException('Incorrect Password')
        }
        // Send Confirmation
        // this is for JWT Token
        const accessToken = await this.jwtService.signAsync({
            sub:user.id,
            email:user.email
        } as ActiveUserData,
        {
            audience:this.jwtConfiguration.audience,
            issuer:this.jwtConfiguration.issuer,
            secret:this.jwtConfiguration.secret,
            expiresIn:this.jwtConfiguration.accessTokenTtl,
        });
        
        return {
            accessToken
        }
    }
}
