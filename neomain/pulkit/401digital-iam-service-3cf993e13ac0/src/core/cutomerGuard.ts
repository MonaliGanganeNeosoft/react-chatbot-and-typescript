import { CryproHelper, TokensHelper } from '@401_digital/xrm-core';
import {
  CanActivate,
  ExecutionContext,
  mixin,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenDTO } from 'src/app/auth/auth.dto';

export function CustomerGuard() {
  class AuthMixingGuard implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest();
      const authorization = request.headers['authorization'];
      if (!authorization) throw new UnauthorizedException();
      const token = TokensHelper.getToken(authorization);
      if (!token) throw new UnauthorizedException();
      let user;
      try {
        user = TokensHelper.verifyToken(
            CryproHelper.decrypt(token),
        );
      } catch (error) {
        if (error.name == 'TokenExpiredError') {
          throw new UnauthorizedException(error.message);
        }
        throw error;
      }

      if (!user) throw new UnauthorizedException();
      request.currentUser = user;
      return true;
    }
  }

  return mixin(AuthMixingGuard);

}
