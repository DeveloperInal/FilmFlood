'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import '@/app/globals.css'
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import {Suspense} from "react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            placeholderData: <Loading />,
        },
    }
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru">
        <body className="bg-gray-900 text-white">
        {/* Обертывание всего приложения в провайдер React Query */}
        <QueryClientProvider client={queryClient}>
            <main className="flex-1 p-4">
                <div className="flex h-screen">
                    <Sidebar/>
                    <div className="flex-1 flex flex-col">
                        <Header/>
                        {children}
                    </div>
                </div>
            </main>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
        </body>
        </html>
    );
}
