'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarDays, Globe, Tag, User, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";

const renderValue = (value: any) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (value && typeof value === 'object' && 'name' in value) return value.name;
    return 'Не указано';
};

export default function FilmDetails({ film }) {
    const router = useRouter();

    const handleActorClick = (actorName: string) => {
        const formattedName = encodeURIComponent(actorName);
        router.push(`/actor/${formattedName}`);
    };

    const handleWatchMovie = () => {
        const formattedName = encodeURIComponent(film.film_name);
        router.push(`/film/film-movie/${formattedName}`);
    };

    return (
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex items-start">
                <div className="md:w-1/3 lg:w-1/4 flex justify-center p-4">
                    <div className="relative w-[300px] h-[300px]">
                        <Image
                            src={film.PosterUrl || '/placeholder.svg'}
                            alt={renderValue(film.film_name)}
                            className="rounded-lg object-contain"
                            width={300}
                            height={450}
                        />
                    </div>
                </div>
                <div className="p-8 md:w-2/3 lg:w-3/4">
                    <div className="uppercase tracking-wide text-sm text-[#FF4136] font-semibold">
                        {renderValue(film.genre)}
                    </div>
                    <h1 className="block mt-1 text-3xl leading-tight font-bold text-white">
                        {renderValue(film.film_name)}
                    </h1>
                    <p className="mt-2 text-gray-300">{renderValue(film.description)}</p>
                    <div className="mt-4 flex flex-wrap gap-4">
                        <div className="flex items-center text-gray-400">
                            <CalendarDays className="h-5 w-5 mr-2 text-[#FF4136]" />
                            <span>{renderValue(film.year_prod)}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <Globe className="h-5 w-5 mr-2 text-[#FF4136]" />
                            <span>{renderValue(film.country)}</span>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-[#FF4136] flex items-center">
                                <Tag className="h-5 w-5 mr-2" />
                                Жанры
                            </h2>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {typeof film.genre === 'string'
                                    ? film.genre.split(',').map((genre, index) => (
                                        <span key={index} className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-white">
                                            {genre.trim()}
                                        </span>
                                    ))
                                    : Array.isArray(film.genre)
                                        ? film.genre.map((genre, index) => (
                                            <span key={index} className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-white">
                                                {renderValue(genre)}
                                            </span>
                                        ))
                                        : <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-white">Жанр не указан</span>
                                }
                            </div>
                        </div>
                        <Button
                            onClick={handleWatchMovie}
                            className="bg-[#FF4136] hover:bg-[#E63631] text-white font-bold py-2 px-4 rounded inline-flex items-center ml-4"
                        >
                            <Play className="h-5 w-4 mr-1" />
                            Смотреть фильм
                        </Button>
                    </div>

                </div>
            </div>
            <div className="p-8">
                <h2 className="text-2xl font-semibold text-[#FF4136] flex items-center mb-4">
                    <User className="h-6 w-6 mr-2" />
                    Актеры
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {film.actorsData && film.actorsData.map((actor, index) => (
                        <div
                            key={index}
                            onClick={() => handleActorClick(actor.name)}
                            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                        >
                            <div className="relative w-full h-48">
                                <Image
                                    src={actor.PosterUrl.posterUrl || '/poster-not.jpg'}
                                    alt={actor.name}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white">{actor.name}</h3>
                                <p className="text-gray-400">Год рождения: {actor.date_of_birth || 'Не указано'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

