'use client';

import Header from '@/components/ui/header';
import Sidebar from '@/components/Sidebar/Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import FilmMovieContent from "@/components/FilmMovie/FilmMovieContent";
import { useParams } from "next/navigation";

export default function FilmMoviePage() {
    const params = useParams();
    const filmName = decodeURIComponent(params.filmName as string);

    return (
        <div className="min-h-screen bg-black">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 flex justify-center p-6">
                    <Card className="max-w-4xl w-full bg-black">
                        <CardContent className="p-6">
                            <FilmMovieContent filmName={filmName} />
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
