import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthTypeEnum } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';
@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthTypeEnum.Bearer;
  private readonly authTypeGuardMap: Record<
    AuthTypeEnum,
    CanActivate | CanActivate[]
  > = {
    [AuthTypeEnum.Bearer]: this.accessTokenGuard,
    [AuthTypeEnum.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflrector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // authTypes from reflector
    const authTypes = this.reflrector.getAllAndOverride(AUTH_TYPE_KEY, [
      // get all the type key assigned to authTypes
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];

    // create array of guards
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    // Default error when user is not authorised
    const error = new UnauthorizedException();

    // loop throw  guards, ifnd canActivate on each instances
    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        error: err;
      });
      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
