import { Module } from '@nestjs/common';
import { FilmResService } from './film_res.service';
import { FilmResController } from './film_res.controller';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Module({
  controllers: [FilmResController],
  providers: [FilmResService, PrismaService, S3Service],
})
export class FilmResModule {}
