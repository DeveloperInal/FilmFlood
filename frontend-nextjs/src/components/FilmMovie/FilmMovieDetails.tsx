import VideoPlayer from '@/components/FilmMovie/CustomPlayer/CustomPlayer'
import FilmCard from '@/components/FilmMovie/FilmCard/FilmCard'

interface FilmMovieDetailsProps {
    film_name: string;
    videoUrl: string;
    randomFilms: Array<{
        id: string;
        film_name: string;
        PosterUrl: string;
        year_prod: string;
    }>;
}

export default function FilmMovieDetails({ film_name, videoUrl, randomFilms }: FilmMovieDetailsProps) {
    return (
        <div className="min-h-screen bg-black text-white">
            <main className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6 text-center">{film_name}</h2>

                <div className="mb-8">
                    <VideoPlayer videoUrl={videoUrl} />
                </div>

                <h3 className="text-2xl font-bold mb-4">Рекомендуемые фильмы</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {randomFilms.map((film) => (
                        <FilmCard key={film.id} {...film} />
                    ))}
                </div>
            </main>
        </div>
    )
}

