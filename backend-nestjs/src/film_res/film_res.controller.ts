import { Controller, Post, Get, Body, Param, Res } from '@nestjs/common';
import { FilmResService } from './film_res.service';
import { addFilmDto } from './dtos/dtos';
import { Response } from 'express';

@Controller('film-res')
export class FilmResController {
  constructor(private readonly filmResService: FilmResService) {}

  @Post('create-film')
  async postFilm(@Body() createFilmDto: addFilmDto) {
    return await this.filmResService.addFilm(createFilmDto);
  }

  @Get('get-films')
  async getFilms(@Res() res: Response) {
    const films = await this.filmResService.getAllFilms();
    return res.json(films);
  }

  @Get('get-film-info/:filmName')
  async getFilmInfo(
    @Param('filmName') filmName: string, 
    @Res() res: Response
  ) {
    const filmInfo = await this.filmResService.getFilmNameInfo(filmName);
    return res.json(filmInfo);
  }

  @Get('get-actor-info/:actorName')
  async getActorInfo(
    @Param('actorName') actorName: string, 
    @Res() res: Response
  ) {
    const actorInfo = await this.filmResService.getActorNameInfo(actorName);
    return res.json(actorInfo);
  }

  @Get('get-url-video/:filmName')
  async getUrlVideo(
    @Param('filmName') filmName: string, 
    @Res() res: Response
  ) {
    const videoUrl = await this.filmResService.getUrlVideo(filmName);
    return res.json(videoUrl);
  }

  @Get('get-films-for-genre/:genre')
  async getFilmsForGenre(
    @Param('genre') genre: string, 
    @Res() res: Response
  ) {
    const films = await this.filmResService.getFilmForGenre(genre);
    return res.json(films);
  }

  @Get('get-film-rating')
  async getFilmRating(
    @Res() res: Response,
    @Param('minRating') minRating: number
  ) {
    const film = await this.filmResService.getFilmRating(minRating);
    return res.json(film);
  }
}
