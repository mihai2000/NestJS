import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../constants/auth.constants';

export const ActiveUser = createParamDecorator(
  // return only the sub and email from the active user or if undefineed, it returns the whole payload
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: ActiveUserData = request[REQUEST_USER_KEY];

    // If a user passes a field to the decorator use only that field
    // if a user  payload is extracted from the req grab the field and return back to the user, if the user didnt mention the field, return it back entire user payload
    return field ? user?.[field] : user;
  },
);
