import { Injectable } from '@nestjs/common';
import { ListObjectsCommand, GetObjectCommand, S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path'; // Для работы с путями файлов
import { config } from 'dotenv';
import * as process from 'node:process';

config();

@Injectable()
export class S3Service {
  private readonly s3Client = new S3Client({
    region: "ru-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: process.env.AWS_ENDPOINT,
  })

  async upload(fileName: string, file: Buffer) {
    const upload = new PutObjectCommand({
        Bucket: 'filmflood',
        Key: fileName,
        Body: file,
    });

    await this.s3Client.send(upload);
  }

  async getFilmPostersUrls(filmNames: string[]): Promise<{ url: string }[]> {
    const searchFilmCommand = new ListObjectsCommand({
      Bucket: 'filmflood',
      Prefix: `poster/films`, // Указываем, что постеры находятся внутри папки с названием фильма
    });
  
    try {
      const filmResponse = await this.s3Client.send(searchFilmCommand);
      // Для каждого фильма из массива filmNames ищем постер
      const filmUrls = await Promise.all(filmNames.map(async (filmName) => {
        // Ищем файл постера для текущего фильма
        const filmFileKey = filmResponse.Contents.find(
          (item) => item.Key && item.Key.endsWith(`${filmName}.jpg`)
        )?.Key;
  
        if (!filmFileKey) {
          throw new Error(`Нету постера для фильма: ${filmName}`);
        }
  
        // Генерируем URL для найденного постера
        const getCommand = new GetObjectCommand({
          Bucket: 'filmflood',
          Key: filmFileKey,
        });
        const url = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 3600 });
  
        return { url };  // Возвращаем объект с url для каждого фильма
      }));
  
      return filmUrls;
    } catch (error) {
      console.error('Ошибка при получении постеров для фильмов', error);
      throw error;
    }
  }  

  async getFilmPosterUrl(filmName: string): Promise<{ url: string }> {
    const searchFilmCommand = new ListObjectsCommand({
      Bucket: 'filmflood',
      Prefix: `poster/films`, // Указываем, что постеры находятся внутри папки с названием фильма
    });
  
    try {
      const filmResponse = await this.s3Client.send(searchFilmCommand);
      // Ищем файл актёра в папке фильма
      const filmFileKey = filmResponse.Contents.find(
        (item) => item.Key && item.Key.endsWith(`${filmName}.jpg`)
      )?.Key;
  
      if (!filmFileKey) {
        throw new Error(`Нету постера для фильма: ${filmName}`);
      }
      // Генерируем URL для найденного постера
      const getCommand = new GetObjectCommand({
        Bucket: 'filmflood',
        Key: filmFileKey,
      });
      const url = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 3600 });
  
      return { url };  // Возвращаем объект с url
    } catch (error) {
      console.error(`Ошибка при получении постера для фильма: ${filmName}`, error);
      throw error;
    }
  }
  
  async getActorPosterUrl(actorName: string): Promise<{ url: string }> {
    const searchActorCommand = new ListObjectsCommand({
      Bucket: 'filmflood',
      Prefix: `poster/actors`, // Указываем путь до папки с фильмом
    });
  
    try {
      // Проверяем наличие папки с фильмом
      const actorResponse = await this.s3Client.send(searchActorCommand);
      // Ищем файл актёра в папке фильма
      const actorFileKey = actorResponse.Contents.find(
        (item) => item.Key && item.Key.endsWith(`${actorName}.jpg`)
      )?.Key;
  
      if (!actorFileKey) {
        throw new Error(`Нету постера для актера: ${actorName}`);
      }
  
      // Получаем URL для найденного файла
      const getCommand = new GetObjectCommand({
        Bucket: 'filmflood',
        Key: actorFileKey,
      });
      const url = await getSignedUrl(this.s3Client, getCommand);
  
      return {
        url
      };
    } catch (error) {
      console.error(`Ошибка при получении постера для актера: ${actorName}`, error);
      return null;
    }
  }
  
  async getVideoUrl(fileName: string): Promise<any> {
    const command = new GetObjectCommand({
      Bucket: 'filmflood',
      Key: `films/${fileName}.mp4`,
    });

    return await getSignedUrl(this.s3Client, command);
  }

  async createUserImage(username: string, image: Buffer) {
    const command = new PutObjectCommand({
      Bucket: 'filmflood',
      Key: `userimage/${username}.jpg`, 
      Body: image, 
    });

    await this.s3Client.send(command); 
  }
  async getUserImage(username: string) {
    const command = new GetObjectCommand({
      Bucket: 'filmflood',
      Key: `userimage/${username}.jpg`,
    });
  
    try {
      const url = await getSignedUrl(this.s3Client, command);
      return url;
    } catch (error) {
      console.error('Ошибка при получении URL изображения:', error);
      return null;
    }
  }
}