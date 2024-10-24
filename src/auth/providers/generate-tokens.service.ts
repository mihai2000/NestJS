import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { UserEntity } from 'src/users/user.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class GenerateTokensService {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  public async generateTokens(user: UserEntity) {
    // array of promises , will wait for completing all the promises for this  array
    const [accessToken, refreshToken] = await Promise.all([
      // Generate the Access Token
      // the partial type of ActivUserData implmented means that we can pass only the email value in the payload
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email },
      ),
      // Generate Refresh Token
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
