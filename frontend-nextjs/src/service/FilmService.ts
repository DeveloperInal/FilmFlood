import axios from "axios";
import {
    IActorsData,
    IFilmData,
    IGenreFilm,
    IFilmComment,
    IGenreCategory
} from "@/types/filmservice.interface";

const responseUrl = 'http://localhost:4200/api'
axios.defaults.baseURL = responseUrl

export class FilmService {
    static async getAllFilmData() {
        return new Promise<IFilmData>(res => {
            axios.get<IFilmData>('/film-res/get-films', {
                withCredentials: true,
            })
               .then(response => res(response.data))
               .catch(error => console.error(error))
        })
    }

    static async getAllSerialData() {
        return new Promise<IFilmData>(res => {
            axios.get<IFilmData>(`/film-res/get-serials`, {
                withCredentials: true,
            })
               .then(response => res(response.data))
               .catch(error => console.error(error))
        })
    }

    static async getAllGenresData() {
        return new Promise<IGenreCategory>(res => {
            axios.get<IGenreCategory>('/film-res/get-all-genres', {
                withCredentials: true
            })
                .then(response => res(response.data))
                .catch(error => console.error(error))
        })
    }

    static async getFilmNameData(film_name: string) {
        return new Promise<IFilmData>(res => {
            axios.get<IFilmData>(`/film-res/get-film-info/${film_name}`, {
                withCredentials: true,
            })
               .then(response => res(response.data))
               .catch(error => console.error(error))
        })
    }

    static async getActorNameData(actor_name: string) {
        return new Promise<IActorsData>(res => {
            axios.get<IActorsData>(`/film-res/get-actor-info/${actor_name}`, {
                withCredentials: true,
            })
               .then(response => res(response.data))
               .catch(error => console.error(error))
        })
    }

    static async getVideoUrl(film_name: string) {
        return new Promise<string>(res => {
            axios.get<string>(`/film-res/get-url-video/${film_name}`, {
                withCredentials: true,
            })
               .then(response => res(response.data))
               .catch(error => console.error(error))
        })
    }

    static async getFilmForGenre(genre: string) {
        return new Promise<IGenreFilm>(res => {
            axios.get<IGenreFilm>(`/film-res/get-films-for-genre/${genre}`, {
                withCredentials: true,
            })
               .then(response => res(response.data))
               .catch(error => console.error(error))
        })
    }

    static async getSerialForGenre(genre: string) {
        return new Promise(res => {
            axios.get<IGenreFilm>(`/film-res/get-serials-for-genre/${genre}`, {
                withCredentials: true,
            })
               .then(response => res(response.data))
               .catch(error => console.error(error))
        })
    }

    static async getCommentFilm(filmName: string) {
        return new Promise<IFilmComment[] | IFilmComment>(res => {
            axios.get<IFilmComment[] | IFilmComment>(`/film-res/get-comments/${filmName}`, {
                withCredentials: true,
            })
               .then(response => res(response.data))
               .catch(error => console.error(error))
        })
    }
}