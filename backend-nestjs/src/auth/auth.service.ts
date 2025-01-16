import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EmailService } from './email/email.service';
import { RedisService } from 'src/redis.service';
import { CreateUserDto, UserDto } from './dtos/auth_user.dto';
import { JwtService } from './jwt/jwt.service';
import { hash, verify } from "argon2";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly email: EmailService,
        private readonly redis: RedisService,
        private readonly jwt: JwtService
    ) {}

    async registerUser(CreateUserDto: CreateUserDto) {
        const { username, email, password } = CreateUserDto;
        const hashPassword = await hash(password);
        const user_candidate = await this.prisma.userTable.findFirst({ where: { email: email } })

        if(user_candidate) {
            throw new Error(`Пользователь с почтой ${user_candidate.email} уже создан!`)
        }

        const userData = {
            username, 
            email, 
            password: hashPassword,
        };
        
        const code = await this.email.sendEmail(email); // Отправляем код на почту
        await this.redis.set(`${code}`, JSON.stringify(userData))
    }

    async validateUser(username: string, password: string, email: string): Promise<any> { // Функция для валидации пользователя и на его существование
        const user = await this.prisma.userTable.findFirst({ where: { username, email } })
        if (user && await verify(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    

    async verifyEmailAndAuthorize(code: number) { // Функция для верификации пользователя по email и коду
        const isVerified = await this.email.compration_code(code);
        if (!isVerified) {
            console.error('Верификация не прошла успешно');
            throw new UnauthorizedException('Неправильный код');
        }

        const userDataString = await this.redis.get(`${code}`);
        if (!userDataString) {
            console.error(`Ключ не найден в кэше Redis: ${code}`);
            throw new UnauthorizedException('Ключ не найден');
        }
        const userData = JSON.parse(userDataString);
        const userInDb = await this.prisma.userTable.create({
        data: {
            ...userData
        }
        });
        // Генерация токенов при успешной верификации
        const userDto = new UserDto(userInDb)
        const tokens = await this.jwt.generateTokens({ ...userDto })
        await this.prisma.tokensTable.create({ data: { userId: userInDb.id, refreshToken: tokens.refreshToken } })

        await this.redis.delete(`${code}`); // Удаление пользователя из кэша после успешной авторизации
        return tokens;
    }

    async authUser(CreateUserDto: CreateUserDto) {
        const { username, email, password } = CreateUserDto;
        const user = await this.prisma.userTable.findFirst({ where: { username: username, email: email } })

        if(!user) {
            throw new BadRequestException(`Пользователь с таким email не найден!`)
        }
        const isPasswordEquals = await verify(user.password, password)
        if(!isPasswordEquals) {
            throw new BadRequestException('Пароли не совпадают!')
        }
        const code = await this.email.sendEmail(user.email);
        await this.redis.set(`${code}`, JSON.stringify(user));
    }

    async verifyUserAuth(code: number) {
        const isVerified = await this.email.compration_code(code);
        if (!isVerified) {
            console.error('Верификация не прошла успешно');
            throw new UnauthorizedException('Неправильный код');
        }

        const userDataString = await this.redis.get(`${code}`);
        if (!userDataString) {
            console.error(`Ключ не найден в кэше Redis: ${code}`);
            throw new UnauthorizedException('Ключ не найден');
        }

        const userData = JSON.parse(userDataString);
        const userDto = new UserDto(userData)
        const tokens = await this.jwt.generateTokens({ ...userDto })

        await this.prisma.tokensTable.create({ data: { userId: userDto.id, refreshToken: tokens.refreshToken } })
        await this.redis.delete(`${code}`)
        
        return tokens
    }

    async logoutUser(refreshToken) {
        const token = await this.jwt.removeToken(refreshToken)
        return token
    }
}
