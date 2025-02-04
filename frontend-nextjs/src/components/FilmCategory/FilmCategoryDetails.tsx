"use client"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

interface Category {
    name: string
    href: string
}

interface Film {
    id: string
    filmName: string
    posterUrl: string
    yearProd: string
}

interface FilmCategoryDetailsProps {
    categories: Category[]
    setHoveredCategory: (category: string | null) => void
    hoveredCategory: string | null
    setSelectedCategory: (category: string | null) => void
    selectedCategory: string | null
    films: Film[]
}

export default function FilmCategoryDetails({
                                                categories,
                                                setHoveredCategory,
                                                hoveredCategory,
                                                setSelectedCategory,
                                                selectedCategory,
                                                films,
                                            }: FilmCategoryDetailsProps) {
    return (
        <div className="flex-1 bg-gray-800 text-foreground min-h-screen p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">Выберите категорию фильмов</h1>
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-7xl mx-auto">
                {/* Category Scroll Area */}
                <div className="w-full md:w-1/3 lg:w-1/4">
                    <ScrollArea className="h-20 md:h-[calc(100vh-200px)] rounded-lg border border-gray-700 p-4 bg-gray-900">
                        <div className="flex md:flex-col gap-3">
                            {categories.map((category, index) => (
                                <button
                                    key={category.href || index}
                                    onClick={() => setSelectedCategory(category.href)}
                                    onMouseEnter={() => setHoveredCategory(category.name)}
                                    onMouseLeave={() => setHoveredCategory(null)}
                                    className={`px-4 py-2 rounded-md transition-all duration-300 text-sm md:text-base w-full text-left ${
                                        hoveredCategory === category.name || selectedCategory === category.href
                                            ? "bg-primary text-primary-foreground"
                                            : "text-white hover:bg-gray-700"
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                {/* Film List */}
                <div className="w-full md:w-2/3 lg:w-3/4 mt-6 md:mt-0">
                    {selectedCategory ? (
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-white">
                                Фильмы в категории: {categories.find((c) => c.href === selectedCategory)?.name}
                            </h2>
                            <ScrollArea className="h-[calc(100vh-300px)] md:h-[calc(100vh-200px)] w-full rounded-lg border border-gray-700 p-4 bg-gray-900">
                                {films && films.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {films.map((film, index) => (
                                            <motion.div
                                                key={film.id || index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Link href={`/film/${film.filmName}`}>
                                                    <Card className="overflow-hidden bg-gray-800 hover:bg-gray-700 transition-colors duration-300">
                                                        <CardContent className="p-0">
                                                            <div className="relative aspect-[2/3] w-full">
                                                                <Image
                                                                    src={film.posterUrl || "/placeholder.svg"}
                                                                    alt={`Постер фильма ${film.filmName}`}
                                                                    fill
                                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <div className="p-3">
                                                                <h3 className="font-semibold truncate text-white text-sm md:text-base">
                                                                    {film.filmName}
                                                                </h3>
                                                                <p className="text-xs md:text-sm text-gray-400">{film.yearProd}</p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-gray-400 text-base">Нет фильмов в данной категории</p>
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-400 text-lg">Выберите категорию для просмотра фильмов</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

