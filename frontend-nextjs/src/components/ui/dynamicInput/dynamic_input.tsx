'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Input } from './input';
import { debounce } from 'lodash';
import { Search } from 'lucide-react';
import { useFilmStore } from '@/stores/filmData';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function DynamicMovieSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { film, getAllFilmData } = useFilmStore();
    const router = useRouter();

    const fetchMovies = useCallback(async () => {
        try {
            await getAllFilmData();
        } catch (err) {
            console.error('Failed to fetch movies:', err);
            setError(`Failed to fetch movies: ${err instanceof Error ? err.message : String(err)}`);
        }
    }, [getAllFilmData]);

    useEffect(() => {
        if (!film || film.length === 0) {
            fetchMovies();
        }
    }, [film, fetchMovies]);

    const debouncedSetSearchTerm = useCallback(
        debounce((term: string) => {
            setSearchTerm(term);
        }, 300),
        []
    );

    const filteredMovies = useMemo(() => {
        if (!film || searchTerm.length < 2) return [];
        return film.filter((movie) =>
            movie.film_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, film]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSetSearchTerm(e.target.value);
    };

    const handleMovieClick = useCallback((filmName: string) => {
        const formattedName = encodeURIComponent(filmName);
        router.push(`/film/${formattedName}`);
    }, [router]);

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="w-full max-w-md mx-auto relative">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Search for a movie..."
                    onChange={handleInputChange}
                    className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {filteredMovies.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredMovies.map((movie) => (
                        <li
                            key={movie.id}
                            onClick={() => handleMovieClick(movie.film_name)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                        >
                            <div className="flex items-center">
                                <Image
                                    src={movie.PosterUrl}
                                    alt={movie.film_name}
                                    width={40}
                                    height={40}
                                    className="rounded-md mr-4"
                                    priority
                                />
                                <span>{movie.film_name}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
