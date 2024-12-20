import Image from 'next/image'
import Link from 'next/link'

interface Movie {
    id: string;
    film_name: string;
    PosterUrl: string;
}

interface MovieGridProps {
    films: Movie | Movie[];
}

export default function MovieDetails({ films }: MovieGridProps) {
    const filmsArray = Array.isArray(films) ? films : [films];

    return (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 -m-4">
                    {filmsArray.map((film) => (
                        <Link
                            key={film.id}
                            href={`/film/${encodeURIComponent(film.film_name)}`}
                            className="group scale-115 transform origin-center"
                        >
                            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-[#111111] transition-transform duration-300 ease-in-out group-hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                                <Image
                                    src={film.PosterUrl || '/placeholder.jpg'}
                                    alt={film.film_name || 'Movie poster'}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 25vw"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                    <h3 className="text-sm font-medium truncate">
                                        {film.film_name || 'Untitled'}
                                    </h3>
                                </div>
                                <div className="absolute inset-0 border-2 border-[#8B0000]/0 group-hover:border-[#8B0000]/50 transition-colors duration-300 rounded-lg z-30" />
                            </div>
                        </Link>
                    ))}
                </div>
    )
}

