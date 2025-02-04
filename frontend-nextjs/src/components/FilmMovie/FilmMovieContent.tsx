"use client"
import { FilmService } from "@/service/FilmService"
import NotFound from "@/app/not-found"
import FilmMovieDetails from "./FilmMovieDetails"
import Loading from "@/components/ui/loading"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

export default function FilmMovieContent({ filmName }) {
    const { addToast, toastComponents } = useToast()
    const { data: videoUrl, error, isPending } = useQuery({
        queryKey: ["videoUrl", filmName],
        queryFn: () => FilmService.getVideoUrl(filmName),
    })

    if (isPending) {
        return <Loading />
    }

    if (error || !videoUrl) {
        return <NotFound />
    }

    const showError = (message: string) => {
        addToast(message, "error")
    }

    return (
        <>
            <FilmMovieDetails film_name={filmName} videoUrl={videoUrl} showError={showError} />
            {toastComponents}
        </>
    )
}

