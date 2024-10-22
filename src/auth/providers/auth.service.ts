import { Injectable,forwardRef,Inject } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dto/signin.dto';
import { SignInService } from './sign-in.service';

@Injectable()
export class AuthService {
constructor(
    @Inject(forwardRef(()=>UsersService))
    private readonly usersService:UsersService,

    private readonly signInService:SignInService
){}
    public async signIn(signInDto:SignInDto){
     return await this.signInService.signIn(signInDto)
    }

    public isAuth(){
        return true;
    }
}
