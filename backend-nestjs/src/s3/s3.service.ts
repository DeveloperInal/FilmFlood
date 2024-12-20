import { Injectable } from '@nestjs/common';
import { ListObjectsCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from "@aws-sdk/lib-storage";
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
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: 'film-flood-bucket',
        Key: fileName,
        Body: file,
      },
    });

    await upload.done();
  }

  async getFilmPostersUrls(genre: string): Promise<{ url: string }[]> {
    const validGenres = [
      'comedy',
      'horrors',
      'boevik',
      'detectiv',
      'drama',
      'multfilm',
      'triller',
    ];
  
    // Проверка на валидность жанра
    if (!validGenres.includes(genre)) {
      throw new Error(`Invalid genre: ${genre}. Valid genres are: ${validGenres.join(', ')}`);
    }
  
    const listCommand = new ListObjectsCommand({
      Bucket: 'film-flood-bucket',
      Prefix: `poster/film/${genre}/`, // Путь до папки жанра
    });
  
    try {
      const response = await this.s3Client.send(listCommand);
  
      if (!response.Contents || response.Contents.length === 0) {
        throw new Error(`No posters found in genre: ${genre}`);
      }
  
      // Формируем массив с постерами (имя файла и URL)
      const posters = await Promise.all(
        response.Contents.map(async (item) => {
          if (item.Key) {
            const getCommand = new GetObjectCommand({
              Bucket: 'film-flood-bucket',
              Key: item.Key,
            });
            const url = await getSignedUrl(this.s3Client, getCommand);
  
            // Извлекаем имя файла из пути
            const fileName = item.Key.split('/').pop()?.replace('.webp', '') ?? 'unknown';
            return { fileName, url };
          }
          return null;
        })
      );
  
      // Фильтруем возможные `null` значения
      return posters.filter((poster): poster is { fileName: string; url: string } => poster !== null);
    } catch (error) {
      console.error(`Error fetching posters for genre: ${genre}`, error);
      throw error;
    }
  }
  
  async getActorPostersUrls(fileName: string): Promise<{ fileName: string; url: string }[]> {
    const listCommand = new ListObjectsCommand({
      Bucket: 'film-flood-bucket',
      Prefix: `poster/actors/${fileName}/`, // Указываем путь до папки
    });
  
    try {
      const response = await this.s3Client.send(listCommand);

      if (!response.Contents) {
        throw new Error(`No files found in folder: ${fileName}`);
      }

      const files = await Promise.all(
        response.Contents.map(async (item) => {
          if (item.Key) {
            const getCommand = new GetObjectCommand({
              Bucket: 'film-flood-bucket',
              Key: item.Key,
            });
            const url = await getSignedUrl(this.s3Client, getCommand);
  
            // Извлекаем имя файла из полного пути
            const name = item.Key.split('/').pop(); // Получаем только имя файла
            return { fileName: name ?? 'unknown', url };
          }
          return null;
        })
      );
  
      return files.filter((file): file is { fileName: string; url: string } => file !== null);
    } catch (error) {
      console.error(`Error fetching files from folder: ${fileName}`, error);
      throw error;
    }
  }

  async getFilmPosterUrl(genre: string, filmName: string): Promise<{ url: string }> {
    const validGenres = [
      'comedy',
      'horrors',
      'boevik',
      'detectiv',
      'drama',
      'multfilm',
      'triller',
    ];
  
    // Проверка на валидность жанра
    if (!validGenres.includes(genre)) {
      throw new Error(`Invalid genre: ${genre}. Valid genres are: ${validGenres.join(', ')}`);
    }
  
    const listCommand = new ListObjectsCommand({
      Bucket: 'film-flood-bucket',
      Prefix: `poster/film/${genre}/`, // Путь до папки жанра
    });
  
    try {
      const response = await this.s3Client.send(listCommand);
  
      if (!response.Contents || response.Contents.length === 0) {
        throw new Error(`No posters found in genre: ${genre}`);
      }
  
      // Ищем файл, соответствующий названию фильма
      const filmKey = response.Contents.find(
        (item) => item.Key && item.Key.includes(`${filmName}.webp`)
      )?.Key;
  
      if (!filmKey) {
        throw new Error(`Poster for film "${filmName}" not found in genre: ${genre}`);
      }
  
      // Генерируем URL для найденного постера
      const getCommand = new GetObjectCommand({
        Bucket: 'film-flood-bucket',
        Key: filmKey,
      });
      const url = await getSignedUrl(this.s3Client, getCommand);
  
      return await { url };
    } catch (error) {
      console.error(`Error fetching poster for film: ${filmName} in genre: ${genre}`, error);
      throw error;
    }
  }

  async getActorPosterUrl(filmName: string, actorName: string): Promise<{ actorName: string; posterUrl: string } | null> {
    const searchFilmCommand = new ListObjectsCommand({
      Bucket: 'film-flood-bucket',
      Prefix: `poster/actors/${filmName}/`, // Указываем путь до папки с фильмом
    });
  
    try {
      // Проверяем наличие папки с фильмом
      const filmResponse = await this.s3Client.send(searchFilmCommand);
  
      if (!filmResponse.Contents || filmResponse.Contents.length === 0) {
        throw new Error(`No posters found for film: ${filmName}`);
      }
  
      // Ищем файл актёра в папке фильма
      const actorFileKey = filmResponse.Contents.find(
        (item) => item.Key && item.Key.endsWith(`${actorName}.webp`)
      )?.Key;
  
      if (!actorFileKey) {
        throw new Error(`No poster found for actor: ${actorName} in film: ${filmName}`);
      }
  
      // Получаем URL для найденного файла
      const getCommand = new GetObjectCommand({
        Bucket: 'film-flood-bucket',
        Key: actorFileKey,
      });
      const url = await getSignedUrl(this.s3Client, getCommand);
  
      return {
        actorName: actorName,
        posterUrl: url,
      };
    } catch (error) {
      console.error(`Error fetching poster for actor: ${actorName} in film: ${filmName}`, error);
      return null;
    }
  }
  
  

  async getVideoUrl(fileName: string, genre: string): Promise<any> {
    const validGenres = [
      'comedy',
      'horrors',
      'boevik',
      'detectiv',
      'drama',
      'multfilm',
      'triller',
    ];
  
    if (!validGenres.includes(genre)) {
      throw new Error(`Invalid genre: ${genre}. Valid genres are: ${validGenres.join(', ')}`);
    }

    const command = new GetObjectCommand({
      Bucket: 'film-flood-bucket',
      Key: `film/${genre}/${fileName}.mp4`,
    });

    return await getSignedUrl(this.s3Client, command);
  }
}