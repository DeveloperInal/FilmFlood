'use client'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useFilmStore } from "@/stores/filmData"
import Loading from "@/components/ui/loading"
import NotFound from "@/app/not-found"

const DynamicFilmDetails = dynamic(() => import('./FilmDetails'), {
    loading: () => <Loading />,
})

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

    return <DynamicFilmDetails film={film} />
}

