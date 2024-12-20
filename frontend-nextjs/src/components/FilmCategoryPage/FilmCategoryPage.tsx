'use client'
import Sidebar from '@/components/Sidebar/Sidebar'
import Header from "@/components/ui/header"
import {Card, CardContent} from "@/components/ui/card";
import FilmCategoryContent from "@/components/FilmCategoryPage/FilmCategoryContent";

export default function FilmCategoryPage() {

    return (
        <div className="min-h-screen bg-black">
            <Header/>
            <div className="flex">
                <Sidebar/>
                <main className="flex-1 flex justify-center p-6">
                    <Card className="max-w-4xl w-full bg-black">
                        <CardContent className="p-6">
                            <FilmCategoryContent />
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}

