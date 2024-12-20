'use client'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useFilmStore } from "@/stores/filmData"
import Loading from "@/components/ui/loading"
import NotFound from "@/app/not-found"

const DynamicActorDetails = dynamic(() => import('./ActorDetails'), {
    loading: () => <Loading />,
    ssr: false,
})

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

    return <DynamicActorDetails actor={actor} />
}

