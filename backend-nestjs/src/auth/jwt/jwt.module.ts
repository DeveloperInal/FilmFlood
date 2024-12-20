import { Module, forwardRef } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { PassportModule } from "@nestjs/passport"
import { PrismaService } from 'src/prisma.service';
import { JwtModule as NestJwtModule } from '@nestjs/jwt'
import { LocalStrategy } from './strategy/local.strategy';
import { AuthModule } from '../auth.module';
import * as fs from "fs"
import * as path from "path"

@Module({
  imports: [
    forwardRef(() => AuthModule),
    PassportModule,
    NestJwtModule.register({
      privateKey: fs.readFileSync(path.resolve('./src/jwt-key/private.key'), 'utf8'), 
      publicKey: fs.readFileSync(path.resolve('./src/jwt-key/public.key'), 'utf8'),   
      signOptions: {
        algorithm: 'RS256', 
        expiresIn: '60s',   
      },
      verifyOptions: {
        algorithms: ['RS256'], 
      },
    }),
  ],
  providers: [PrismaService, LocalStrategy, JwtService],
  exports: [JwtService]
})
export class JwtModule {}