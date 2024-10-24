import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dto/google-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensService } from 'src/auth/providers/generate-tokens.service';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly generateTokensService: GenerateTokensService,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      // verify the google token sent by user
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });
      // extract the payload from the google jwt
      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = loginTicket.getPayload();
      // find the user in the database using the googleId
      const user = await this.usersService.findOneByGoogleId(googleId);
      // if google exsts generate tokens
      if (user) {
        return this.generateTokensService.generateTokens(user);
      }
      // if not, create a new user and then generate tokens
      const newUser = await this.usersService.createGoogleUser({
        email: email,
        firstName: firstName,
        lastName: lastName,
        googleId: googleId,
      });
      // throw unauthorised exeption
      return this.generateTokensService.generateTokens(newUser);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
