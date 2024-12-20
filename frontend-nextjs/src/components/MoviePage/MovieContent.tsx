'use client'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useFilmStore } from "@/stores/filmData"
import Loading from "@/components/ui/loading"
import NotFound from "@/app/not-found"

const DynamicMovieDetails = dynamic(() => import('./MovieDetails'), {
    loading: () => <Loading />,
    ssr: false, // Ensure that this component is not pre-rendered on the server side, as it uses the client-side store
})

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

    return <DynamicMovieDetails films={film} />
}

