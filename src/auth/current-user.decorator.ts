import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../user/user.entity';

export interface AuthenticatedRequest extends Request {
  user: User;
}

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
