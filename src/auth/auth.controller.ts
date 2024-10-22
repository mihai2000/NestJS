import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    // Inject Auth Service
    constructor(private readonly authService:AuthService){}

    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    public async signIn(@Body() signInDto:SignInDto){
        return this.authService.signIn(signInDto);
    }
}
