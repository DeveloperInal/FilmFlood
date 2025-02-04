import { Module } from '@nestjs/common';
import {CacheModule} from "@nestjs/cache-manager";
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { FilmResModule } from './film_res/film_res.module';
import { FilmResController } from './film_res/film_res.controller';
import { FilmResService } from './film_res/film_res.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from './auth/jwt/jwt.service';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { EmailModule } from './auth/email/email.module';
import { RedisService } from './redis.service';
import { EmailService } from './auth/email/email.service';
import { S3Module } from './s3/s3.module';
import { S3Service } from './s3/s3.service';
import { S3Controller } from './s3/s3.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), CacheModule.register({
    isGlobal: true,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  }), FilmResModule, AuthModule, EmailModule, S3Module, UserModule],
  controllers: [FilmResController, S3Controller],
  providers: [PrismaService, FilmResService, AuthService, NestJwtService, EmailService, JwtService, RedisService, S3Service],
})
export class AppModule {}
