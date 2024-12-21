'use client'
import Loading from "@/components/ui/loading";
import { useState, useEffect } from "react";
import { useFilmStore } from "@/stores/filmData";
import FilmCategoryDetails from "./FilmCategoryDetails";

export default function FilmCategoryContent() {
    const categories = [
        { name: 'Боевики', href: 'boevik' },
        { name: 'Комедии', href: 'comedy' },
        { name: 'Драмы', href: 'drama' },
        { name: 'Ужасы', href: 'horrors' },
    ]

    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const { getFilmForGenre, loading, genre } = useFilmStore()

    if(loading) {
        return <Loading />
    }

    useEffect(() => {
        if (selectedCategory) {
            getFilmForGenre(selectedCategory)
        }
    }, [selectedCategory, getFilmForGenre])

    return (
        <FilmCategoryDetails
            categories={categories}
            setHoveredCategory={setHoveredCategory}
            hoveredCategory={hoveredCategory}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            film={genre}
        />
    )
}

