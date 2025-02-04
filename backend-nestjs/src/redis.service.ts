import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService { // Класс для кэширования данных с помощью Redis
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'redis', // Используйте переменные окружения
      port: Number(process.env.REDIS_PORT) || 6379,
      db: Number(process.env.REDIS_DB) || 0,
    });
  }

  async set(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  async get(key: string): Promise<any> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}