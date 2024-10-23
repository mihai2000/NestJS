import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dto/signin.dto';
import { AuthTypeEnum } from './enums/auth-type.enum';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    // Inject Auth Service
    constructor(private readonly authService:AuthService){}

    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    @Auth(AuthTypeEnum.None) // assined none, to be publicallly available
    public async signIn(@Body() signInDto:SignInDto){
        return this.authService.signIn(signInDto);
    }
}
