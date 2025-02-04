"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { CalendarDays, Globe, Tag, User, Play, Clock, Star, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Audiowide } from "next/font/google"

const audiowide = Audiowide({
    weight: "400",
    subsets: ["latin"],
})

const renderValue = (value: any) => {
    if (typeof value === "string") return value
    if (typeof value === "number") return value.toString()
    if (Array.isArray(value)) return value.join(", ")
    if (value && typeof value === "object" && "name" in value) return value.name
    return "Не указано"
}

export default function FilmDetails({ film }) {
    const router = useRouter()

    const handleActorClick = (actorName: string) => {
        const formattedName = encodeURIComponent(actorName)
        router.push(`/actor/${formattedName}`)
    }

    const handleWatchMovie = () => {
        const formattedName = encodeURIComponent(film.filmName)
        router.push(`/film/film-movie/${formattedName}`)
    }

    return (
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden" style={audiowide.style}>
            <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="flex justify-center p-4 w-full md:w-1/3 lg:w-1/4">
                    <div className="relative w-[200px] h-[300px] md:w-[300px] md:h-[450px]">
                        <Image
                            src={film.posterUrl || "/placeholder.svg"}
                            alt={renderValue(film.filmName)}
                            className="rounded-lg object-contain"
                            fill
                        />
                    </div>
                </div>
                <div className="p-4 md:p-8 w-full md:w-2/3 lg:w-3/4">
                    <h1 className="block mt-1 text-2xl md:text-3xl leading-tight font-bold text-white">
                        {renderValue(film.filmName)}
                    </h1>
                    <p className="mt-2 text-gray-300 text-sm md:text-base">{renderValue(film.description)}</p>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        <InfoItem icon={CalendarDays} label="Год выпуска" value={film.yearProd} />
                        <InfoItem icon={Globe} label="Страна" value={film.country} />
                        <InfoItem icon={Star} label="Рейтинг" value={film.rating} />
                        <InfoItem icon={Shield} label="Возрастной рейтинг" value={film.ageRating} />
                        <InfoItem icon={Clock} label="Длительность" value={`${film.watchTime}`} />
                    </div>
                    <div className="mt-6 flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-lg md:text-xl font-semibold text-[#3333ff] flex items-center">
                                <Tag className="h-5 w-5 mr-2" />
                                Жанры
                            </h2>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {typeof film.genre === "string" ? (
                                    film.genre.split(",").map((genre, index) => (
                                        <span key={index} className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-white">
                      {genre.trim()}
                    </span>
                                    ))
                                ) : Array.isArray(film.genre) ? (
                                    film.genre.map((genre, index) => (
                                        <span key={index} className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-white">
                      {renderValue(genre)}
                    </span>
                                    ))
                                ) : (
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-white">
                    Жанр не указан
                  </span>
                                )}
                            </div>
                        </div>
                        <Button
                            onClick={handleWatchMovie}
                            className="bg-[#6666ff] hover:bg-[#3333ff] text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                            <Play className="h-5 w-4 mr-1" />
                            Смотреть фильм
                        </Button>
                    </div>
                </div>
            </div>
            <div className="p-4 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold text-[#3333ff] flex items-center mb-4">
                    <User className="h-6 w-6 mr-2" />
                    Актеры
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {film.actorsData &&
                        film.actorsData.map((actor, index) => (
                            <div
                                key={index}
                                onClick={() => handleActorClick(actor.actorName)}
                                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                            >
                                <div className="relative w-full h-36 sm:h-48">
                                    <Image
                                        src={actor.posterUrl.url || "/poster-not.jpg"}
                                        alt={actor.actorName}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                                <div className="p-2 sm:p-4">
                                    <h3 className="text-sm sm:text-lg font-semibold text-white">{actor.actorName}</h3>
                                    <p className="text-gray-400 text-xs sm:text-sm">Год рождения: {actor.dateOfBirth || "Не указано"}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center text-gray-400 text-sm md:text-base">
            <Icon className="h-5 w-5 mr-2 text-[#6666ff]" />
            <span>
        <span className="font-medium text-white">{label}:</span> {renderValue(value)}
      </span>
        </div>
    )
}

