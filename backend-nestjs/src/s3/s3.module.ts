import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Module as S3ModuleService } from 'nestjs-s3';
import { S3Controller } from './s3.controller';
import { config } from "dotenv"
import * as process from 'node:process';

config();

@Module({
  imports: [
    S3ModuleService.forRoot({
      config: {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        region: 'ru-1',
        endpoint: process.env.AWS_ENDPOINT,
        forcePathStyle: true,
      },
    }),
  ],
  controllers: [S3Controller],
  providers: [S3Service],
})
export class S3Module {}
