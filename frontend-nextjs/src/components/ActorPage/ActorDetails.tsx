'use client';

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Ruler, Film } from 'lucide-react';

export default function ActorDetails({ actor }) {
    console.log(actor.films)

    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-[300px,1fr] gap-8">
                <div className="space-y-4">
                    <Image
                        src={actor.PosterUrl || '/placeholder.svg'}
                        alt={actor.name || "Actor"}
                        className="w-full rounded-lg border-2 border-[#8B0000]"
                        width={300}
                        height={450}
                    />
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-400">
                            <CalendarDays className="h-4 w-4 text-[#8B0000]" />
                            <span>{actor.date_of_birth || "Дата рождения не указана"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Ruler className="h-4 w-4 text-[#8B0000]" />
                            <span>{actor.height ? `${actor.height} см` : "Рост не указан"}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-white border-b border-[#8B0000] pb-2">
                        {actor.name || "Имя актера не указано"}
                    </h1>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-[#8B0000]">Биография</h2>
                        <p className="text-gray-300">{actor.biography || "Биография отсутствует"}</p>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Film className="h-6 w-6 mr-2 text-[#8B0000]" />
                    Фильмография
                </h2>
                {actor.films ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            <Link key={actor.films.id} href={`/film/${encodeURIComponent(actor.films.film_name || '')}`}>
                                <div className="bg-zinc-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                                    <div className="relative w-full h-48">
                                        <Image
                                            src={actor.films.PosterUrl.url || '/poster-not.jpg'}
                                            alt={actor.films.film_name || 'Без названия'}
                                            width={300}
                                            height={450}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-white font-semibold truncate">
                                            {actor.films.film_name || 'Название не указано'}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            {actor.films.year_prod || 'Год не указан'}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                    </div>
                ) : (
                    <div className="text-white">Нет доступных фильмов</div>
                )}
            </div>
        </div>
    );
}

