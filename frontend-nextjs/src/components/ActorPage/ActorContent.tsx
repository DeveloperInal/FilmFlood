'use client'
import { useEffect } from 'react'
import { useFilmStore } from "@/stores/filmData"
import Loading from "@/components/ui/loading"
import NotFound from "@/app/not-found"
import ActorDetails from './ActorDetails'

export default function ActorContent({ actorName }: { actorName: string }) {
    const { actor, loading, getActorNameData } = useFilmStore()

    useEffect(() => {
        getActorNameData(actorName)
    }, [getActorNameData, actorName])

    if (loading) {
        return <Loading />
    }

    if (!actor) {
        return <NotFound />
    }

    return <ActorDetails actor={actor} />
}

