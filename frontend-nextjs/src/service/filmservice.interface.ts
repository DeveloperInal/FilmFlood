export interface IFilmData {
    id: string;
    film_name: string;
    description: string;
    year_prod: number;
    country: string;
    genres: string;
    PosterUrl: string;
    actorsData: IActors[] | IActors
}

export interface IActorsData {
    name: string;
    date_of_birth: string;
    height: number;
    biography: string;
    films: IFilms[] | IFilms
}

export interface IActors {
    PosterUrl: string;
    actorName: string;
    date_of_birth: string;
}

export interface IFilms {
    film_name: string;
    description: string;
    year_prod: number;
    country: string;
    genre: string[];
    PosterUrl: string;
}

export interface IGenreFilm {
    id: string;
    film_name: string;
    description: string;
    year_prod: number;
    country: string;
    PosterUrl: string;
    genre: {
        id: string;
        name: string;
    };
}

export interface IFilmsRandom {
    id: string;
    film_name: string;
    year_prod: number;
    PosterUrl: string;
}