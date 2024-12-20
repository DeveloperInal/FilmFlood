import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import * as fs from "fs"
import * as path from "path"
import { PrismaService } from 'src/prisma.service';
import { UserDto } from '../dtos/auth_user.dto';

@Injectable()
export class JwtService {
    constructor(
        private readonly jwtService: NestJwtService,
        private readonly prismaService: PrismaService
    ) {}

    async validateAccessToken(accessToken: string) {
        try {
            const publicKey: any = fs.readFileSync(path.resolve('./src/jwt-key/public.key'), 'utf8');
            const token = await this.jwtService.verify(accessToken, publicKey)
            return token;
        } catch(error) {
            return null;
        }
    }

    async validateRefreshToken(refreshToken: string) {
        try {
            const publicKey: any = fs.readFileSync(path.resolve('./src/jwt-key/public.key'), 'utf8');
            const token = await this.jwtService.verify(refreshToken, publicKey)
            return token;
        } catch(error) {
            return null;
        }
    }

    async generateTokens(payload: any) {
        const privateKey = fs.readFileSync(path.resolve('./src/jwt-key/private.key'), 'utf8');

        const accessToken = await this.jwtService.sign(payload, {
            privateKey: privateKey,
            algorithm: 'RS256',
            expiresIn: '20m',
        })
        
        const refreshToken = this.jwtService.sign(payload, {
            privateKey: privateKey,
            algorithm: 'RS256',
            expiresIn: '14d',
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await this.prismaService.tokensTable.findFirst({ where: { user: userId } })
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData;
        }
        const token = await this.prismaService.tokensTable.create({ data: { user: userId, refreshToken: refreshToken } })
        return token;
    }

    async removeToken(refreshToken: string) {
        const tokenData = await this.prismaService.tokensTable.deleteMany({ where: { refreshToken: refreshToken } })
        return tokenData;
    }

    async refreshToken(refreshToken: string) {
        if(!refreshToken) {
            throw new UnauthorizedException('Токена не существует!')
        }
        const tokenData = await this.validateRefreshToken(refreshToken)
        const tokenFromDb = await this.prismaService.tokensTable.findFirst({ where: { refreshToken: tokenData } })
        if(!tokenData || !tokenFromDb) {
            throw new UnauthorizedException()
        }
        const user = await this.prismaService.userTable.findFirst({ where: { id: tokenFromDb.id } })
        const userDto = new UserDto(user)
        const tokens = await this.generateTokens({ ...userDto })
        await this.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens
        }
    }
}
