import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthenticationService } from './providers/google-authentication.service';
import { GoogleTokenDto } from './dto/google-token.dto';
import { AuthTypeEnum } from '../enums/auth-type.enum';
import { Auth } from '../decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@Auth(AuthTypeEnum.None)
@Controller('auth/google-authentication')
@ApiTags('Google Auth')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post()
  public authenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return this.googleAuthenticationService.authenticate(googleTokenDto);
  }
}
