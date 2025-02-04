'use client'
import Loading from "@/components/ui/loading"
import NotFound from "@/app/not-found"
import MovieDetails from './MovieDetails'
import { useQuery } from "@tanstack/react-query";
import { FilmService } from "@/service/FilmService";

export default function MovieContent() {
    const { data: films, error, isPending } = useQuery({queryKey: ['filmAll'], queryFn: FilmService.getAllFilmData})
    const { data: serials } = useQuery({queryKey: ['serialAll'], queryFn: FilmService.getAllSerialData})

    if (isPending) {
        return <Loading />
    }

    if (!films || error) {
        return <NotFound />
    }

    return <MovieDetails films={films} serials={serials} />
}