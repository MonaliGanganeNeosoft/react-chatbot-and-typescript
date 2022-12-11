import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersEntity } from 'src/app/users/users.entity';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const currentUser = ctx.switchToHttp().getRequest().currentUser;
    return currentUser as UsersEntity;
  },
);
