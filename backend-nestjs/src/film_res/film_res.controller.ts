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

  @Get('get-comments/:filmName')
  async getComments(
    @Param('filmName') filmName: string,
    @Res() res: Response
  ) {
    const commentData = await this.filmResService.getComments(filmName);
    return res.json(commentData);
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

  @Get('get-all-genres') 
  async getAllGenre(
  ) {
    return await this.filmResService.getAllGenres();
  }

  @Get('get-serials-for-genre/:genre')
  async getSerialsForGenre(
    @Param('genre') genre: string, 
    @Res() res: Response
  ) {
    const serials = await this.filmResService.getSerialForGenre(genre);
    return res.json(serials);
  }

  @Get('get-film-rating/:minRating')
  async getFilmRating(
    @Res() res: Response,
    @Param('minRating') minRating: number
  ) {
    const film = await this.filmResService.getFilmRating(minRating);
    return res.json(film);
  }

  @Get('get-serial-rating/:minRating')
  async getSerialRating(
    @Res() res: Response,
    @Param('minRating') minRating: number
  ) {
    const serial = await this.filmResService.getSerialRating(minRating);
    return res.json(serial);
  }

  @Get('get-serials')
  async getSerials(
    @Res() res: Response
  ) {
    const serials = await this.filmResService.getAllSerials();
    return res.json(serials);
  }

  @Get('get-serial-info/:serialName')
  async getSerialInfo(
    @Param('serialName') serialName: string, 
    @Res() res: Response
  ) {
    const serialInfo = await this.filmResService.getSerialNameInfo(serialName);
    return res.json(serialInfo);
  }
}
