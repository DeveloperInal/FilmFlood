import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { EmailService } from './email/email.service';
import { RedisService } from 'src/redis.service';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [forwardRef(() => JwtModule)],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, EmailService, RedisService],
  exports: [AuthService]
})
export class AuthModule {}