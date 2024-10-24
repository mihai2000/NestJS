import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dto/signin.dto';
import { SignInService } from './sign-in.service';
import { refreshTokenDto } from '../dto/refresh-token.dto';
import { RefreshTokensService } from './refresh-tokens.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly signInService: SignInService,

    private readonly refreshTokensService: RefreshTokensService,
  ) {}
  public async signIn(signInDto: SignInDto) {
    return await this.signInService.signIn(signInDto);
  }

  public async refreshTokens(refreshTokenDto: refreshTokenDto) {
    return await this.refreshTokensService.refreshTokens(refreshTokenDto);
  }
}
