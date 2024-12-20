// LocalAuthGuard
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const code = request.params.code;

    if (!code) { // Условие проверки введенных данных
      throw new UnauthorizedException('Почта или код не переданы');
    }
    return true;
  }
}
