"use client"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Ruler, Film, MapPin, Briefcase, User } from "lucide-react"
import { Audiowide } from "next/font/google"

const audiowide = Audiowide({
    weight: "400",
    subsets: ["latin"],
})

export default function ActorDetails({ actor }) {
    return (
        <div className="space-y-8 p-4 md:p-8 bg-gray-900" style={audiowide.style}>
            <div className="grid md:grid-cols-[300px,1fr] gap-8">
                <div className="space-y-6">
                    <Image
                        src={actor.posterUrl || "/placeholder.svg"}
                        alt={actor.actorName || "Actor"}
                        className="rounded-lg border-2 border-[#2b82d9] max-w-[250px] mx-auto shadow-lg"
                        width={250}
                        height={350}
                        priority
                    />
                </div>

                <div className="space-y-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-white border-b-2 border-[#2b82d9] pb-2">
                        {actor.actorName || "Имя актера не указано"}
                    </h1>

                    <div className="space-y-4 bg-gray-700 p-6 rounded-lg shadow-md">
                        <div className="space-y-3 bg-gray-900 p-4 rounded-lg shadow-md">
                            <InfoItem icon={CalendarDays} label="Дата рождения" value={actor.dateOfBirth}/>
                            <InfoItem icon={Ruler} label="Рост" value={actor.growth ? `${actor.growth} см` : null}/>
                            <InfoItem icon={MapPin} label="Место рождения" value={actor.placeOfBirth}/>
                            <InfoItem icon={User} label="Пол" value={actor.sex}/>
                            <InfoItem icon={CalendarDays} label="Возраст" value={actor.age ? `${actor.age} лет` : null}/>
                            <InfoItem icon={Briefcase} label="Карьера" value={actor.career}/>
                        </div>
                        <h2 className="text-xl md:text-2xl font-semibold text-[#2b82d9]">Биография</h2>
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                            {actor.biography || "Биография отсутствует"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center">
                    <Film className="h-8 w-8 mr-3 text-[#2b82d9]"/>
                    Фильмография
                </h2>
                {actor.films ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {actor.films.map((film) => (
                            <Link key={film.id} href={`/film/${encodeURIComponent(film.filmName || "")}`}>
                                <div
                                    className="bg-zinc-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    <div className="relative w-full h-60">
                                        <Image
                                            src={film.posterUrl || "/poster-not.jpg"}
                                            alt={film.filmName || "Без названия"}
                                            layout="fill"
                                            objectFit="cover"
                                            className="w-full h-full object-cover"
                                            priority
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-white font-semibold truncate text-sm md:text-base">
                                            {film.filmName || "Название не указано"}
                                        </h3>
                                        <p className="text-gray-400 text-xs md:text-sm mt-1">{film.yearProd || "Год не указан"}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-white text-center py-8 bg-zinc-800 rounded-lg">Нет доступных фильмов</div>
                )}
            </div>
        </div>
    )
}

function InfoItem({ icon: Icon, label, value }) {
    if (!value) return null
    return (
        <div className="flex items-center gap-2 text-gray-300">
            <Icon className="h-5 w-5 text-[#2b82d9]" />
            <span className="text-sm">
        <span className="font-medium text-white">{label}:</span> {value}
      </span>
        </div>
    )
}

