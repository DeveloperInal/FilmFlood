import { Controller, Post, Res, Body, HttpStatus, UseGuards, Param, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/auth_user.dto';
import { Response } from 'express';
import { LocalAuthGuard } from './jwt/strategy/local-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('create-user')
  async createUser(
    @Body() createUserDto: CreateUserDto, 
    @Res() res: Response
  ) { 
    try {
      await this.authService.registerUser(createUserDto);
      return res.status(HttpStatus.CREATED).json({ message: `Продолжайте аунтдефикацию`})
    } catch(error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Ошибка при создании пользователя', error })
    }
  }

  @Post('verify-email/:code')
  @UseGuards(LocalAuthGuard)
  async verifyEmail(
    @Param('code') code: number,
    @Res() res: Response
  ) {
    try {
      const tokens = await this.authService.verifyEmailAndAuthorize(code);
      res.setHeader('Authorization', `Bearer ${tokens.accessToken}`)
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: true, 
        sameSite: 'strict', 
        maxAge: 1_209_600_000, 
      });

      return res.status(HttpStatus.CREATED).json({ message: "Регистрация прошла успешно!", tokens })
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Верификация провалена, пожалуйста введите код!', error });
    }
  }

  @Post('auth-user')
  async authUser(
    @Body() CreateUserDto: CreateUserDto,
    @Res() res: Response
  ) {
    try { // Блок который будет проверять есть ли такой пользователь в бд
      await this.authService.authUser(CreateUserDto)
      return res.status(HttpStatus.CREATED).json({ message: `Пользователь cуществует, продолжайте` })
    } catch(error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Такого пользователя не сущесвует, пожалуйста зарегистрируйтесь и пройдите валидацию" })
    }
  }

  @Post('verify-user/:code')
  @UseGuards(LocalAuthGuard)
  async verifyUser(
    @Param('code') code: number,
    @Res() res: Response,
    @Req() req: Request
  ) {
    try { // Функция для авторизации по коду
    const tokens = await this.authService.verifyUserAuth(code);
    res.setHeader('Authorization', `Bearer ${tokens.accessToken}`)

    res.cookie('refreshToken', tokens.refreshToken, {
      sameSite: 'strict', 
      httpOnly: true,
      secure: true,
      maxAge: 1_209_600_000, 
    });

    return res.status(HttpStatus.CREATED).json({ message: "Авторизация прошла успешно!", tokens })
  } catch(error) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Авторизация провалена, введите код еще раз!' })
  }
  }

  @Post('logout-user')
  async logoutUser(
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const token = req.cookies['refreshToken']
      await this.authService.logoutUser(token)
      res.clearCookie('refreshToken')
      res.status(HttpStatus.OK).json({ message: 'Токен успешно удален' })
    } catch(error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: "Токен не найден", error })
    }
  }
}
