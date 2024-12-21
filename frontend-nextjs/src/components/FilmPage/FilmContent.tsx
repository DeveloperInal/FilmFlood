'use client'
import { useEffect } from 'react'
import { useFilmStore } from "@/stores/filmData"
import Loading from "@/components/ui/loading"
import NotFound from "@/app/not-found"
import FilmDetails from './FilmDetails'

export default function FilmContent({ filmName }: { filmName: string }) {
    const { film, loading, getFilmNameData } = useFilmStore()

    useEffect(() => {
        getFilmNameData(filmName)
    }, [getFilmNameData, filmName])

    if (loading) {
        return <Loading />
    }

    if (!film) {
        return <NotFound />
    }

    return <FilmDetails film={film} />
}

