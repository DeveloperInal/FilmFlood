import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { addFilmDto } from './dtos/dtos';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class FilmResService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service
  ) {}

  async addFilm(addFilmDto: addFilmDto) {
    try {
      const newFilm = await this.prisma.filmTable.create({
        data: {
          filmName: addFilmDto.filmName,
          description: addFilmDto.description,
          yearProd: addFilmDto.yearProd,
          rating: addFilmDto.rating,
          type: addFilmDto.type,
          ageRating: addFilmDto.ageRating,
          watchTime: addFilmDto.watchTime,
          country: {
            connectOrCreate: addFilmDto.country.map((country) => ({
              where: { countryName: country }, // Подключаем страну по уникальному "name"
              create: { countryName: country }, // Создаем страну, если ее нет
            })),
          },
          actors: {
            create: addFilmDto.actors.map((actor) => ({
              actor: {
                connectOrCreate: {
                  where: { actorName: actor.actorName }, // Если актер уже существует, подключаем его
                  create: {
                    actorName: actor.actorName,
                    career: actor.career,
                    dateOfBirth: actor.date_of_birth,
                    placeOfBirth: actor.place_of_birth,
                    sex: actor.sex,
                    age: actor.age,
                    growth: actor.growth,
                    biography: actor.biography,
                  }, // Создаем актера
                },
              },
            })),
          },
          genres: {
            connectOrCreate: addFilmDto.genres.map((genreName) => ({
              where: { genreName: genreName }, // Подключаем жанр по уникальному "name"
              create: { genreName: genreName }, // Создаем жанр, если его нет
            })),
          },
        },
        include: {
          actors: {
            include: {
              actor: true,
            },
          },
          genres: true,
          country: true,
          comments: {
            include: {
              user: true,
            },
          },
        },
      });
  
      return newFilm;
    } catch (error) {
      console.error('Error adding film:', error);
      throw new Error(error.message);
    }
  }

  async getAllFilms() {
    const filmsData = await this.prisma.filmTable.findMany({
      where: {
        type: "movie"
      },
      include: {
        genres: true,
        country: true
      },
      take: 10,
    });

    
    const films = await Promise.all(
      filmsData.map(async (film) => {
        const filmPoster = await this.s3Service.getFilmPostersUrls([film.filmName]);
          return await {
            id: film.id,
            filmName: film.filmName,
            yearProd: film.yearProd,
            rating: film.rating,
            posterUrl: filmPoster[0].url || null, 
          };
        })
    );
    return films;
  }

  async getAllSerials() {
    const serialsData = await this.prisma.filmTable.findMany({
      where: {
        type: "serial"
      },
      include: {
        genres: true,
        country: true
      },
      take: 10,
    });

    
    const serials = await Promise.all(
      serialsData.map(async (serial) => {
        const filmPoster = await this.s3Service.getFilmPostersUrls([serial.filmName]);
          return await {
            id: serial.id,
            filmName: serial.filmName,
            yearProd: serial.yearProd,
            rating: serial.rating,
            posterUrl: filmPoster[0].url || null, 
          };
        })
    );
    return serials;
  }
  
  async getActorNameInfo(actorName: string) {
    const actor = await this.prisma.actor.findFirst({
      where: {
        actorName: actorName,
      },
      include: {
        films: {
          include: {
            film: {
              include: {
                genres: true,
              },
            },
          },
        },
      },
    });
  
    if (!actor) {
      throw new Error(`Актер с именем "${actorName}" не найден.`);
    }
  
    const actorPoster = await this.s3Service.getActorPosterUrl(actor.actorName);
    const filmNames = actor.films.map(filmItem => filmItem.film.filmName);
    const filmUrls = await this.s3Service.getFilmPostersUrls(filmNames);
  
    const films = actor.films.map((filmItem, index) => ({
      id: filmItem.film.id,
      filmName: filmItem.film.filmName,
      yearProd: filmItem.film.yearProd,
      posterUrl: filmUrls[index]?.url, 
      genres: filmItem.film.genres, 
    }));
  
    const actorInfo = {
      actorName: actor.actorName,
      dateOfBirth: actor.dateOfBirth,
      growth: actor.growth,
      placeOfBirth: actor.placeOfBirth,
      sex: actor.sex,
      age: actor.age,
      career: actor.career,
      biography: actor.biography,
      films: films,
      posterUrl: actorPoster.url,
    };
  
    return actorInfo;
  }  

  async getFilmNameInfo(filmName: string) {
    
    const film = await this.prisma.filmTable.findFirst({
      where: {
        filmName: filmName,
      },
      include: {
        genres: true,
        actors: {
          include: {
            actor: true
          }
        },
        country: true
      },
    });

    const posterUrl = await this.s3Service.getFilmPosterUrl(film.filmName);
    const actorsData = await Promise.all(
      film.actors.map(async (actors) => {
          return {
              actorName: actors.actor.actorName,
              dateOfBirth: actors.actor.dateOfBirth,
              posterUrl: await this.s3Service.getActorPosterUrl(actors.actor.actorName) || null,
          };
      })
  );

    const filmInfo = {
      filmName: film.filmName,
      description: film.description,
      yearProd: film.yearProd,
      ageRating: film.ageRating,
      watchTime: film.watchTime,
      country: film.country[0].countryName,
      rating: film.rating,
      genre: film.genres[0].genreName,
      actorsData: actorsData,
      posterUrl: posterUrl.url,
    }
    return await filmInfo
  }

  async getSerialNameInfo(filmName: string) {
    
    const serials = await this.prisma.filmTable.findFirst({
      where: {
        filmName: filmName,
        type: "serial"
      },
      include: {
        genres: true,
        actors: {
          include: {
            actor: true
          }
        },
        country: true
      },
    });

    const posterUrl = await this.s3Service.getFilmPosterUrl(serials.filmName);
    const actorsData = await Promise.all(
      serials.actors.map(async (actors) => {
          return {
              actorName: actors.actor.actorName,
              dateOfBirth: actors.actor.dateOfBirth,
              posterUrl: await this.s3Service.getActorPosterUrl(actors.actor.actorName) || null,
          };
      })
  );

    const filmInfo = {
      filmName: serials.filmName,
      description: serials.description,
      yearProd: serials.yearProd,
      ageRating: serials.ageRating,
      watchTime: serials.watchTime,
      country: serials.country[0].countryName,
      rating: serials.rating,
      genre: serials.genres[0].genreName,
      actorsData: actorsData,
      posterUrl: posterUrl.url,
    }
    return await filmInfo
  }

  async getUrlVideo(filmName: string) {
    const film = await this.prisma.filmTable.findFirst({
      where: {
        filmName: filmName
      },
      include: {
        genres: true,
      },
    });

    const videoUrl = await this.s3Service.getVideoUrl(film.filmName);

    return await videoUrl
  }

  async getFilmForGenre(genre: string) {
    const filmsData = await this.prisma.filmTable.findMany({
      where: {
        genres: {
          some: 
          {
            genreName: genre
          }
        },
        type: "movie"
      },
      include: {
        genres: true,
        country: true
      }
    });
  
    const films = await Promise.all(
      filmsData.map(async (film) => {
          const filmPoster = await this.s3Service.getFilmPostersUrls([film.filmName]);
    
          return await {
            id: film.id,
            filmName: film.filmName,
            yearProd: film.yearProd,
            rating: film.rating,
            posterUrl: filmPoster[0].url || null, 
          };
        })
    );
    return films;
  }

  async getSerialForGenre(genre: string) {
    const serialsData = await this.prisma.filmTable.findMany({
      where: {
        genres: {
          some: 
          {
            genreName: genre
          }
        },
        type: "serial"
      },
      include: {
        genres: true,
        country: true
      }
    });
  
    const serialPromises = Promise.all(
      serialsData.map(async (serial) => {
        const filmPoster = await this.s3Service.getFilmPosterUrl(serial.filmName);
  
        return {
          id: serial.id,
          filmName: serial.filmName,
          yearProd: serial.yearProd,
          rating: serial.rating,
          posterUrl: filmPoster.url,
        };
      })
    );
  
    return serialPromises;
  }

  async getComments(filmName: string) {
    const film = await this.prisma.filmTable.findUnique({ where: { filmName } });
    if (!film) {
      throw new NotFoundException('Фильм не найден');
    }
    
    const comments = await this.prisma.commentFilm.findMany({
      where: { film: { filmName } },
      select: { userId: true ,text: true, rating: true },
    });

    const commentData = await Promise.all(
      comments.map(async (comment) => {
        const user = await this.prisma.userTable.findFirst({ where: { id: comment.userId } });
        const userImage = await this.s3Service.getUserImage(user.username);
        return {
          username: user.username,
          text: comment.text,
          rating: comment.rating,
          userImage
        };
      })
    );
    
    return commentData;
  }
  
  async getFilmRating(minRating: number): Promise<any[]> {
    const ratingNumber = typeof minRating === 'string' ? parseFloat(minRating) : minRating;

    if (ratingNumber > 10) {
        throw new Error('Рейтинг не может быть выше 10.');
    }
  
    const filmsData = await this.prisma.filmTable.findMany({
      where: {
        rating: {
          gte: ratingNumber, 
        },
      },
      include: {
        genres: true,
        country: true
      }
    });
  
    const filmPromises = Promise.all(
      filmsData.map(async (film) => {
        const filmPoster = await this.s3Service.getFilmPosterUrl(film.filmName);
  
        return {
          id: film.id,
          filmName: film.filmName,
          yearProd: film.yearProd,
          rating: film.rating,
          posterUrl: filmPoster.url,
        };
      })
    );
  
    return filmPromises;
  }
  async getSerialRating(minRating: number): Promise<any[]> {
    const ratingNumber = typeof minRating === 'string' ? parseFloat(minRating) : minRating;

    if (ratingNumber > 10) {
        throw new Error('Рейтинг не может быть выше 10.');
    }
  
    const serialsData = await this.prisma.filmTable.findMany({
      where: {
        rating: {
          gte: ratingNumber, 
        },
      },
      include: {
        genres: true,
        country: true
      }
    });
  
    const serialPromises = Promise.all(
      serialsData.map(async (serial) => {
        const filmPoster = await this.s3Service.getFilmPostersUrls([serial.filmName]);
  
        return {
          id: serial.id,
          filmName: serial.filmName,
          yearProd: serial.yearProd,
          rating: serial.rating,
          posterUrl: filmPoster[0].url || null, 
        };
      })
    );
  
    return serialPromises;
  }

  async getAllGenres() {
    const genres = await this.prisma.genre.findMany();
    const genresData = genres.map(genre => {
        return {
            name: genre.genreName.charAt(0).toUpperCase() + genre.genreName.slice(1), // Первая буква заглавная
            href: genre.genreName // Оставляем href как есть
        };
    });

    return genresData;
}
}
