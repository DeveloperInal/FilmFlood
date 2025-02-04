import VideoPlayer from "@/components/FilmMovie/CustomPlayer/CustomPlayer"
import { Audiowide } from "next/font/google"
import CommentContent from "@/components/FilmMovie/Comment/CommentContent"

interface FilmMovieDetailsProps {
    film_name: string
    videoUrl: string
    showError: (message: string) => void
}

const audiowide = Audiowide({
    weight: "400",
    subsets: ["latin"],
})

export default function FilmMovieDetails({ film_name, videoUrl, showError }: FilmMovieDetailsProps) {
    const handlePlayerError = () => {
        const errorMessage = `Ошибка при воспроизведении видео: Ссылка на фильм не получена`
        showError(errorMessage)
    }

    return (
        <div className="min-h-screen bg-black text-white" style={audiowide.style}>
            <main className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6 text-center">{film_name}</h2>

                <div className="mb-8">
                    <VideoPlayer videoUrl={videoUrl} onError={handlePlayerError} />
                </div>
            </main>
            <div>
                <CommentContent filmName={film_name} />
            </div>
        </div>
    )
}

