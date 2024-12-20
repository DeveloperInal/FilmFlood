import { filmDataInterface} from "@/stores/filmData.interface";
import { create } from "zustand";
import FilmService from "@/service/FilmService"

export const useFilmStore = create<filmDataInterface>((set) => ({
    actor: null,
    film: [],
    genre: null,
    videoUrl: null,
    loading: false,
    error: null,

    getAllFilmData: async () => {
        set({ loading: true, error: null });
        try {
            const response = await FilmService.getAllFilmData();
            if (Array.isArray(response)) {
                set({ loading: false, film: response });
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error: any) {
            set({ loading: false, error: error.message || "Failed to fetch data" });
        }
    },


    getFilmNameData: async (film_name: string) => {
        set({loading: true, error: null, film: null});
        try {
            const response = await FilmService.getFilmNameData(film_name);
            set({loading: false, film: response});
        } catch (error) {
            set({loading: false, error: error.message});
        }
    },

    getActorNameData: async (actor_name: string) => {
        set({loading: true, error: null, actor: null});
        try {
            const response = await FilmService.getActorNameData(actor_name);
            set({loading: false, actor: response });
        } catch (error) {
            set({loading: false, error: error.message});
        }
    },
    getVideoUrl: async (film_name: string): Promise<string | null> => {
        set({ loading: true, error: null });
        try {
            const url = await FilmService.getVideoUrl(film_name);
            set({ loading: false });
            return url || null; // Возвращаем null, если URL отсутствует
        } catch (error) {
            console.error(error);
            set({ loading: false, error });
            return null; // Возвращаем null в случае ошибки
        }
    },

    getFilmForGenre: async (genre: string): Promise<string | null> => {
        set({ loading: true, error: null, genre: null });
        try {
            const response = await FilmService.getFilmForGenre(genre);
            set({ loading: false, genre: response });
        } catch (error) {
            console.error(error);
            set({ loading: false, error });
            return null; // Возвращаем null в случае ошибки
        }
    },

    getFilmRandom: async () => {
        set({ loading: false, error: null})
        try {
            const response = await FilmService.getFilmRandom();
            set({ loading: false });
            return response;
        } catch (error) {
            console.error(error);
            set({ loading: false, error });
            return null; // Возвращаем null в случае ошибки
        }
    }
}))