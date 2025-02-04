"use client"
import { Card, CardContent } from '@/components/ui/card';
import MovieContent from '@/components/MoviePage/MovieContent';

export default function MoviePage() {
    return (
        <main className="flex-1 flex justify-center p-6">
            <Card className="max-w-4xl w-full bg-gray-700 border-[#8B0000]">
                <CardContent className="p-6">
                    <MovieContent />
                </CardContent>
            </Card>
        </main>
    )
};
