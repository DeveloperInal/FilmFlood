'use client'
import {Card, CardContent} from "@/components/ui/card";
import FilmCategoryContent from "@/components/FilmCategory/FilmCategoryContent";

export default function FilmCategoryPage() {

    return (
        <main className="flex-1 flex justify-center p-6">
            <Card className="max-w-4xl w-full bg-gray-700">
                <CardContent className="p-6">
                    <FilmCategoryContent />
                </CardContent>
            </Card>
        </main>
    )
}

