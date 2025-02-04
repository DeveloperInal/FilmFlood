"use client";
import Loading from "@/components/ui/loading";
import { useState } from "react";
import { FilmService } from "@/service/FilmService";
import FilmCategoryDetails from "./FilmCategoryDetails";
import { useQuery } from "@tanstack/react-query";

export default function FilmCategoryContent() {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const { data: genres, isLoading: isLoadingGenres, isError: IsErrorGenres  } = useQuery({ queryKey: ["allGenres"], queryFn: FilmService.getAllGenresData })

    const genresArray = Array.isArray(genres) ? genres : [genres];

    // Получаем данные о фильмах по выбранному жанру
    const { data: films, isLoading, isError } = useQuery({
        queryKey: ["filmForGenre", selectedCategory], // Ключ запроса с выбранным жанром
        queryFn: () => FilmService.getFilmForGenre(selectedCategory!), // Запрос фильмов
        enabled: !!selectedCategory, // Запрос выполняется только если выбран жанр
    });

    // Пока идет загрузка
    if (isLoading || isLoadingGenres) {
        return <Loading />;
    }

    // Если возникла ошибка
    if (isError || IsErrorGenres) {
        return <div className="text-center text-red-600">Не удалось загрузить фильмы</div>;
    }

    // Если объект `films` пустой
    const filmsArray = Array.isArray(films) ? films : films ? [films] : []
    const convertedFilms = filmsArray.map((film) => ({
        ...film,
        yearProd: film.yearProd != null ? film.yearProd.toString() : "",
    }))
    // Основной контент
    return (
        <FilmCategoryDetails
            categories={genresArray}
            setHoveredCategory={setHoveredCategory}
            hoveredCategory={hoveredCategory}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            films={convertedFilms} // Передаем фильмы в дочерний компонент
        />
    );
}
