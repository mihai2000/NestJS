import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { refreshTokenDto } from '../dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensService } from './generate-tokens.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class RefreshTokensService {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly generateTokensService: GenerateTokensService,
  ) {}
  public async refreshTokens(refreshTokenDto: refreshTokenDto) {
    try {
      // verify the refresh token sent by the user to be valid jwtService, jwtConfiguration
      // the Pick active user data , need to pick the sub property from the user data, to verify the actuallity and for generating new tokens
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        // will return the payload
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      // Fetch user form databse
      const user = await this.usersService.findOneById(sub);

      // generate the tokens
      return await this.generateTokensService.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
