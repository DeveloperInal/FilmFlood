import Image from "next/image";
import Link from "next/link";
import { IGenreFilm } from "@/service/filmservice.interface";
import Loading from "@/components/ui/loading";

interface Category {
    name: string
    href: string
}

interface FilmCategoryDetailsProps {
    categories: Category[]
    setHoveredCategory: (category: string | null) => void
    hoveredCategory: string | null
    setSelectedCategory: (category: string | null) => void
    selectedCategory: string | null
    film: IGenreFilm[] | null
}

export default function FilmCategoryDetails({
                                                categories,
                                                setHoveredCategory,
                                                hoveredCategory,
                                                setSelectedCategory,
                                                selectedCategory,
                                                film
                                            }: FilmCategoryDetailsProps) {
    return (
        <div className="flex-1 bg-black flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold text-white mb-16">
                Выберите категорию фильмов
            </h1>
            <div className="grid grid-cols-2 gap-8 w-full max-w-2xl mb-8">
                {categories.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.href)}
                        onMouseEnter={() => setHoveredCategory(category.name)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        className={`
                            h-32 rounded-lg
                            transition-all duration-300 ease-in-out
                            flex items-center justify-center
                            ${hoveredCategory === category.name || selectedCategory === category.href
                            ? 'bg-red-700 scale-105'
                            : 'bg-zinc-900 hover:bg-zinc-800'
                        }
                        `}
                    >
                        <span className="text-xl font-semibold text-white">
                            {category.name}
                        </span>
                    </button>
                ))}
            </div>
            {selectedCategory && (
                <div className="w-full max-w-4xl">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Фильмы в категории: {categories.find(c => c.href === selectedCategory)?.name}
                    </h2>
                    {film && film.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {film.map((film) => (
                                <Link key={film.id} href={`/film/${film.film_name}`}>
                                    <div className="bg-zinc-800 rounded-lg overflow-hidden">
                                        <Image
                                            src={film.PosterUrl}
                                            alt={film.film_name}
                                            width={300}
                                            height={450}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-2">
                                            <h3 className="text-white font-semibold truncate">{film.film_name}</h3>
                                            <p className="text-gray-400 text-sm">{film.year_prod}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-white"><Loading /></div>
                    )}
                </div>
            )}
        </div>
    )
}

