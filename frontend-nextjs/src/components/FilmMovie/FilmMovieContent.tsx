'use client';

import { useState, useEffect } from 'react';
import { useFilmStore } from "@/stores/filmData";
import NotFound from "@/app/not-found";
import FilmMovieDetails from './FilmMovieDetails';
import Loading from "@/components/ui/loading";

export default function FilmMovieContent({ filmName }) {
    const { getVideoUrl, getFilmRandom } = useFilmStore();
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [randomFilms, setRandomFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [url, films] = await Promise.all([
                    getVideoUrl(filmName),
                    getFilmRandom()
                ]);
                setVideoUrl(url);
                setRandomFilms(Array.isArray(films) ? films : []);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err instanceof Error ? err : new Error("An unknown error occurred"));
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [filmName, getVideoUrl, getFilmRandom]);

    if (loading) {
        return <Loading />;
    }

    if (error || !videoUrl) {
        return <NotFound />;
    }

    return <FilmMovieDetails film_name={filmName} videoUrl={videoUrl} randomFilms={randomFilms} />;
}

