'use client'
import { useEffect } from 'react'
import { useFilmStore } from "@/stores/filmData"
import Loading from "@/components/ui/loading"
import NotFound from "@/app/not-found"
import MovieDetails from './MovieDetails'

export default function MovieContent() {
    const { film, loading, getAllFilmData } = useFilmStore()

    useEffect(() => {
        getAllFilmData()
    }, [getAllFilmData])

    if (loading) {
        return <Loading />
    }

    if (!film) {
        return <NotFound />
    }

    return <MovieDetails films={film} />
}