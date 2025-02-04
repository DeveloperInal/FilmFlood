"use client";
import Loading from "@/components/ui/loading";
import { useState } from "react";
import { FilmService } from "@/service/FilmService";
import SerialCategoryDetails from "./SerialDetails"
import { useQuery } from "@tanstack/react-query";

export default function SerialCategoryContent() {
    const { data: genres, isLoading: isLoadingGenres, isError: IsErrorGenres  } = useQuery({ queryKey: ["allGenres"], queryFn: FilmService.getAllGenresData })

    const genresArray = Array.isArray(genres) ? genres : [genres];

    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Получаем данные о фильмах по выбранному жанру
    const { data: serials, isLoading, isError } = useQuery({
        queryKey: ["serialForGenre", selectedCategory], // Ключ запроса с выбранным жанром
        queryFn: () => FilmService.getSerialForGenre(selectedCategory!), // Запрос фильмов
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
    const serialsArray = Array.isArray(serials) ? serials : serials ? [serials] : []
    const convertedSerials = serialsArray.map((serial) => ({
        ...serial,
        yearProd: serial.yearProd != null ? serial.yearProd.toString() : "",
    }))
    // Основной контент
    return (
        <SerialCategoryDetails
            categories={genresArray}
            setHoveredCategory={setHoveredCategory}
            hoveredCategory={hoveredCategory}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            serials={convertedSerials} // Передаем фильмы в дочерний компонент
        />
    );
}
