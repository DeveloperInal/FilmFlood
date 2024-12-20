import {IFilmsRandom} from "@/service/filmservice.interface";

export interface filmDataInterface {
    loading: boolean;
    actor: any,
    film: any,
    genre: any,
    error: string | null;
    getFilmRandom: () => Promise<IFilmsRandom>
    getAllFilmData: () => Promise<void>;
    getFilmForGenre: (genre: string) => Promise<string | null>
    getVideoUrl: (film_name) => Promise<string | null>;
    getFilmNameData: (film_name) => Promise<void>
    getActorNameData: (actor_name) => Promise<void>;
}