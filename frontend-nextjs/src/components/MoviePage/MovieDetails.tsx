import Image from "next/image"
import Link from "next/link"

interface MediaItem {
    id?: string
    filmName: string
    posterUrl: string
    yearProd?: number
}

interface MovieDetailsProps {
    films: MediaItem
    serials: MediaItem
}

export default function MovieDetails({ films, serials }: MovieDetailsProps) {
    const filmsArray = Array.isArray(films) ? films : [films]
    const serialsArray = Array.isArray(serials) ? serials : [serials]

    const MediaGrid = ({ items }: { items: MediaItem[];}) => (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {items.map((item, index) => (
                <Link key={item.id || index} href={`/film/${encodeURIComponent(item.filmName)}`} className="group">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 transition-transform duration-300 ease-in-out group-hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                        <Image
                            src={item.posterUrl || "/placeholder.jpg"}
                            alt={item.filmName || "Poster"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <h3 className="text-sm sm:text-base font-medium truncate">{item.filmName || "Untitled"}</h3>
                            {item.yearProd && <p className="text-xs text-gray-300 mt-1">{item.yearProd}</p>}
                        </div>
                        <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 transition-colors duration-300 rounded-lg z-30" />
                    </div>
                </Link>
            ))}
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-700 p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                <section>
                    <h1 className="text-4xl font-bold mb-8 text-center text-white">Фильмы</h1>
                    <MediaGrid items={filmsArray} />
                </section>

                <section>
                    <h1 className="text-4xl font-bold mb-8 text-center text-white">Сериалы</h1>
                    <MediaGrid items={serialsArray} />
                </section>
            </div>
        </div>
    )
}

