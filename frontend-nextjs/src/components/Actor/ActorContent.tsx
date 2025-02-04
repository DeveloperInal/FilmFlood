'use client'
import Loading from "@/components/ui/loading"
import NotFound from "@/app/not-found"
import ActorDetails from './ActorDetails'
import {useQuery} from "@tanstack/react-query";
import {FilmService} from "@/service/FilmService";

export default function ActorContent({ actorName }: { actorName: string }) {
    const { data, error, isPending } = useQuery({queryKey: ['actorName', actorName], queryFn: () => FilmService.getActorNameData(actorName)})

    if (isPending) {
        return <Loading />
    }

    if (!data || error) {
        return <NotFound />
    }

    return <ActorDetails actor={data} />
}

