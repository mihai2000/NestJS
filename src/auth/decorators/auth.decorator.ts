import { SetMetadata } from '@nestjs/common';
import { AuthTypeEnum } from '../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';


export const Auth = (...authTypesEnum: AuthTypeEnum[]) =>
     SetMetadata(AUTH_TYPE_KEY, authTypesEnum);
