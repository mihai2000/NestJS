import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './providers/auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    // Inject Auth Service
    constructor(private readonly authService:AuthService){}
}
