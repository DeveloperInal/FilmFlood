import Image from 'next/image';
import Link from 'next/link';

interface FilmCardProps {
    id: string;
    film_name: string;
    PosterUrl: string;
    year_prod: string;
}

export default function FilmCard({ id, film_name, PosterUrl, year_prod }: FilmCardProps) {
    return (
        <Link href={`/film/${encodeURIComponent(film_name)}`}>
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full h-48">
                    <Image
                        src={PosterUrl || '/placeholder.svg'}
                        alt={film_name}
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <div className="p-4">
                    <h3 className="text-white font-semibold truncate">{film_name}</h3>
                    <p className="text-gray-400 text-sm">{year_prod}</p>
                </div>
            </div>
        </Link>
    );
}

