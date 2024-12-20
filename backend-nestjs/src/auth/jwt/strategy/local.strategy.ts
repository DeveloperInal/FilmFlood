// LocalStrategy
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService
  ) {
    super({
      passReqToCallback: true,
      usernameField: 'username'
    }); 
  }
  async validate(req: any, username: string, password: string): Promise<any> { // Фукнция для валидации и существования пользователя
    const emailusr = req.body.email;
    const user = await this.authService.validateUser(username, password, emailusr);
    if (!user) {
      throw new UnauthorizedException(); // Пользователь не авторизован, либо ошибка при вводе данных, либо пользователь не был зарегистрирован
    }
    return user; 
  }
}
