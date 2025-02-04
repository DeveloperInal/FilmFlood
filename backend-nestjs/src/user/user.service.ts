import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly s3Service: S3Service
    ) {}

    async getUserProfile(userId: string) {
        const user = await this.prisma.userTable.findFirst({ where: { id: userId }, include: { comments: true } });
        
        if (!user) {
            throw new Error('User not found');
        }
    
        const filmId = user.comments.map(comment => comment.filmId);
        const films = await this.prisma.filmTable.findMany({ where: { id: { in: filmId } } });
    
        const filmsMap = films.reduce((acc, film) => {
            acc[film.id] = film.filmName;
            return acc;
        }, {});

        const filmsPosters = await this.s3Service.getFilmPostersUrls(films.map(film => film.filmName));
        const filmPostersMap = filmsPosters.reduce((acc, poster, index) => {
            // Сопоставляем по filmId, чтобы избежать путаницы
            const film = films[index];
            if (film) {
                acc[film.id] = poster.url; // Связываем filmId с URL постера
            }
            return acc;
        }, {});
    
        // Формируем данные комментариев с названием фильма и постером
        const filmCommentsData = user.comments.map(comment => ({
            filmName: filmsMap[comment.filmId],
            yearProd: films.find(film => film.id === comment.filmId)?.yearProd,
            text: comment.text,
            filmPoster: filmPostersMap[comment.filmId]
        }));
        
        const userImage = await this.s3Service.getUserImage(user.username);

        return {
            username: user.username,
            email: user.email,
            createProfile: user.createdAt,
            updatedProfile: user.updatedAt,
            imageProfile: userImage,
            comments: filmCommentsData,
        };
    }    

    async createComment(filmName: string, userId: string, text: string, rating: number) {
            const film = await this.prisma.filmTable.findUnique({ where: { filmName } });
            if (!film) {
              throw new NotFoundException('Фильм не найден');
            }
        
            const existingComment = await this.prisma.commentFilm.findFirst({
              where: { film: { filmName }, userId },
            });
            if (existingComment) {
              throw new BadRequestException('Вы уже оставили отзыв на этот фильм');
            }
        
            await this.prisma.commentFilm.create({
              data: {
                film: {
                  connect: { filmName }
                },
                user: {
                  connect: { id: userId }
                },
                rating: rating,
                text,
              },
            });
        
            const filmComments = await this.prisma.commentFilm.findMany({
              where: { film: { filmName } },
              select: { rating: true },
            });
        
            const newRating = filmComments.reduce((acc, cur) => acc + cur.rating, 0) / filmComments.length;
        
            await this.prisma.filmTable.update({
              where: { filmName },
              data: { rating: parseFloat(newRating.toFixed(2)) },
            });
        
            return { message: 'Рейтинг добавлен успешно' };
    }

    async createUserImage(image: Buffer, userId: string) {
        const user = await this.prisma.userTable.findFirst({ where: { id: userId } });
        await this.s3Service.createUserImage(user.username, image);
    }
}
