import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { addFilmDto } from './dtos/film_dto';
import { S3Service } from 'src/s3/s3.service';
import { connect } from 'http2';
import { console } from 'inspector';

@Injectable()
export class FilmResService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service
  ) {}

  async addFilm(addFilmDto: addFilmDto) {
    try {
      const newFilm = await this.prisma.kinoTable.create({
        data: {
          film_name: addFilmDto.film_name,
          description: addFilmDto.description,
          year_prod: addFilmDto.year_prod,
          country: addFilmDto.country,
          actors: {
            create: addFilmDto.actors.map((actor) => ({
              actor: {
                connectOrCreate: {
                  where: { name: actor.name }, // Если актер уже существует, подключаем его
                  create: {
                    name: actor.name,
                    date_of_birth: actor.date_of_birth,
                    height: actor.height,
                    biography: actor.biography,
                  }, // Создаем актера
                },
              },
            })),
          },
          genres: {
            connectOrCreate: addFilmDto.genres.map((genreName) => ({
              where: { name: genreName }, // Подключаем жанр по уникальному "name"
              create: { name: genreName }, // Создаем жанр, если его нет
            })),
          },
        },
        include: {
          actors: {
            include: {
              actor: true,
            },
          },
          genres: true
        },
      });
  
      return newFilm;
    } catch (error) {
      console.error('Error adding film:', error);
      throw new Error(error.message);
    }
  }

  async getAllFilms() {
    const filmsData = await this.prisma.kinoTable.findMany({
      include: {
        genres: true
      }
    });
  
    const films = await Promise.all(
      filmsData.map(async (film) => {
        try {
          const genre = film.genres[0].name
          const filmPoster = await this.s3Service.getFilmPosterUrl(genre, film.film_name);
    
          return await {
            id: film.id,
            film_name: film.film_name,
            description: film.description,
            year_prod: film.year_prod,
            country: film.country,
            genre,
            PosterUrl: filmPoster.url || null, // Возвращаем null, если постер не найден
          };
        } catch (error) {
          console.error(`Error fetching poster for film: ${film.film_name} in genre: ${film.genres[0]?.name || 'Unknown'} Error:`, error.message);
          return await {
            id: film.id,
            film_name: film.film_name,
            description: film.description,
            year_prod: film.year_prod,
            country: film.country,
            genre: film.genres[0]?.name || 'Unknown',
            PosterUrl: null, // Указываем null для постера, если произошла ошибка
          };
        }
      })
    );
  
    return films;
  }
  
  
  async getActorNameInfo(actorName: string) {
    const actor = await this.prisma.actor.findFirst({
      where: {
        name: actorName
      },
      include: {
        films: {
          include: {
            film: {
              include: {
                genres: true
              }
            }
          }
        },
      },
    });
    
    if (!actor) {
      throw new Error(`Актер с именем "${actorName}" не найден.`); 
    }
    const actorPoster = await this.s3Service.getActorPosterUrl(actor.films[0].film.film_name, actor.name);
    const filmUrl = await this.s3Service.getFilmPosterUrl(actor.films[0].film.genres[0].name, actor.films[0].film.film_name);

    const actorInfo = {
      name: actor.name,
      date_of_birth: actor.date_of_birth,
      height: actor.height,
      biography: actor.biography,
      films: {
        id: actor.films[0].film.id,
        film_name: actor.films[0].film.film_name,
        year_prod: actor.films[0].film.year_prod,
        PosterUrl: filmUrl,
      },
      PosterUrl: actorPoster.posterUrl
    }
    return await actorInfo
  }

  async getFilmNameInfo(filmName: string) {
    
    const film = await this.prisma.kinoTable.findFirst({
      where: {
        film_name: filmName
      },
      include: {
        genres: true,
        actors: {
          include: {
            actor: true
          }
        }
      },
    });

    const posterUrl = await this.s3Service.getFilmPosterUrl(film.genres[0].name, film.film_name);
    const actorsData = await Promise.all(
      film.actors.map(async (actor) => {
          return {
              name: actor.actor.name,
              date_of_birth: actor.actor.date_of_birth,
              PosterUrl: await this.s3Service.getActorPosterUrl(film.film_name, actor.actor.name),
          };
      })
  );

    const filmInfo = {
      film_name: film.film_name,
      description: film.description,
      year_prod: film.year_prod,
      country: film.country,
      genre: film.genres[0].name,
      actorsData: actorsData,
      PosterUrl: posterUrl.url,
    }
  
    return await filmInfo
  }

  async getUrlVideo(filmName: string) {
    const film = await this.prisma.kinoTable.findFirst({
      where: {
        film_name: filmName
      },
      include: {
        genres: true,
      },
    });

    const videoUrl = await this.s3Service.getVideoUrl(film.film_name, film.genres[0].name);

    return await videoUrl
  }

  async getFilmForGenre(genre: string) {
    const filmsData = await this.prisma.kinoTable.findMany({
      where: {
        genres: {
          some: 
          {
            name: genre
          }
        }
      },
      include: {
        genres: true
      }
    });
  
    const films = await Promise.all(
      filmsData.map(async (film) => {
        try {
          const genre = film.genres[0].name;
          const filmPoster = await this.s3Service.getFilmPosterUrl(genre, film.film_name);
    
          return await {
            id: film.id,
            film_name: film.film_name,
            description: film.description,
            year_prod: film.year_prod,
            country: film.country,
            genre,
            PosterUrl: filmPoster.url || null, // Возвращаем null, если постер не найден
          };
        } catch (error) {
          console.error(`Error fetching poster for film: ${film.film_name} in genre: ${film.genres[0]?.name || 'Unknown'} Error:`, error.message);
          return await {
            id: film.id,
            film_name: film.film_name,
            description: film.description,
            year_prod: film.year_prod,
            country: film.country,
            genre: film.genres[0]?.name || 'Unknown',
            PosterUrl: null, // Указываем null для постера, если произошла ошибка
          };
        }
      })
    );
  
    return films;
  }
  async getFilmRandom() {
    const filmsData = await this.prisma.kinoTable.findMany({
        include: {
            genres: true,
        },
    });

    // Перемешивание массива фильмов
    const shuffledFilms = filmsData.sort(() => 0.5 - Math.random());
    
    // Выбор первых 5 фильмов
    const randomFilms = shuffledFilms.slice(0, 5);

    // Обработка данных для каждого фильма
    const filmPromises = randomFilms.map(async (film) => {
        const genre = film.genres[0]?.name || 'unknown'; // Если жанров нет, используем 'unknown'
        const filmPoster = await this.s3Service.getFilmPosterUrl(genre, film.film_name);

        return {
            id: film.id,
            film_name: film.film_name,
            year_prod: film.year_prod,
            PosterUrl: filmPoster.url || null, // Возвращаем null, если постер не найден
        };
    });

    // Ожидание завершения всех запросов
    return Promise.all(filmPromises);
}

}
