"use client"
import { Card, CardContent } from '@/components/ui/card';
import FilmContent from "@/components/FilmPage/FilmContent";
import { useParams } from "next/navigation";

export default function FilmPage() {
    const params = useParams()
    const filmName = (params.filmName as string)

    return (
        <main className="flex-1 flex justify-center p-6">
            <Card className="max-w-4xl w-full bg-gray-700 border-[#8B0000]">
                <CardContent className="p-6">
                    <FilmContent filmName={decodeURIComponent(filmName)} />
                </CardContent>
            </Card>
        </main>
    )
};

