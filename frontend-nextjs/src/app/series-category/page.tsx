'use client'
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/ui/header";

const SeriesCategory = () => {
    return (
        <div className="flex h-screen">
            <Sidebar/>
            <div className="flex-1 flex flex-col">
                <Header/>
                <div className="flex items-center justify-center min-h-screen bg-black">
                    <div className="text-center">
                        <h1 className="text-6xl font-bold text-white mb-4 relative">
                            <span className="absolute -top-14 left-24 text-red-600 z-40">Скоро...</span>
                        </h1>
                        <p className="text-xl text-white">Мы работаем над чем-то потрясающим😊‼️</p>
                        <div className="mt-8">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SeriesCategory