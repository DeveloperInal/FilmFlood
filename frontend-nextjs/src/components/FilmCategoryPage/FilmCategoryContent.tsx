'use client'

import dynamic from "next/dynamic";
import Loading from "@/components/ui/loading";
import { useState, useEffect } from "react";
import { useFilmStore } from "@/stores/filmData";

const DynamicFilmCategoryDetails = dynamic(() => import('./FilmCategoryDetails'), {
    loading: () => <Loading />,
})

export default function FilmCategoryContent() {
    const categories = [
        { name: 'Боевики', href: 'boevik' },
        { name: 'Комедии', href: 'comedy' },
        { name: 'Драмы', href: 'drama' },
        { name: 'Ужасы', href: 'horrors' },
    ]

    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const { getFilmForGenre, genre } = useFilmStore()

    useEffect(() => {
        if (selectedCategory) {
            getFilmForGenre(selectedCategory)
        }
    }, [selectedCategory, getFilmForGenre])

    return (
        <DynamicFilmCategoryDetails
            categories={categories}
            setHoveredCategory={setHoveredCategory}
            hoveredCategory={hoveredCategory}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            film={genre}
        />
    )
}

