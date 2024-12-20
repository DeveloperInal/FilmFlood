import axios from "axios";
import {IActorsData, IFilmData, IFilmsRandom, IGenreFilm} from "@/service/filmservice.interface";

const responseUrl = 'http://localhost:4200/api'
axios.defaults.baseURL = responseUrl

class FilmService {
    static async getAllFilmData() {
        try {
            const response = await axios.get<IFilmData>('/film-res/get-films', {
                withCredentials: true,
            })
            return response.data;
        } catch (e) {
            console.error(e)
            throw new Error(e)
        }
    }

    static async getFilmNameData(film_name: string) {
        try {
            const response = await axios.get<IFilmData>(`/film-res/get-film-info/${film_name}`, {
                withCredentials: true,
            })
            return response.data;
        } catch (e) {
            console.error(e)
            throw new Error(e)
        }
    }

    static async getActorNameData(actor_name: string) {
        try {
            const response = await axios.get<IActorsData>(`/film-res/get-actor-info/${actor_name}`, {
                withCredentials: true,
            })
            return response.data;
        } catch (e) {
            console.error(e)
            throw new Error(e)
        }
    }

    static async getVideoUrl(film_name: string) {
        try {
            const response = await axios.get<string>(`/film-res/get-url-video/${film_name}`, {
                withCredentials: true,
            })
            return response.data;
        } catch (e) {
            console.error(e)
            throw new Error(e)
        }
    }

    static async getFilmForGenre(genre: string) {
        try {
            const response = await axios.get<IGenreFilm>(`/film-res/get-films-for-genre/${genre}`, {
                withCredentials: true,
            })
            console.log(response.data)
            return response.data;
        } catch (e) {
            console.error(e)
            throw new Error(e)
        }
    }

    static async getFilmRandom() {
        try {
            const response = await axios.get<IFilmsRandom>(`/film-res/get-random-film`, {
                withCredentials: true,
            })
            return response.data;
        } catch (e) {
            console.error(e)
            throw new Error(e)
        }
    }
}

export default FilmService;