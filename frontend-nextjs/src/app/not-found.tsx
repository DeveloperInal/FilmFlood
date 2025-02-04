'use client'
import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 text-blue-900">
            <div className="w-full max-w-lg text-center px-4">
                <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
                <div className="w-full h-2 bg-blue-500 mb-8"></div>
                <h2 className="text-4xl font-semibold mb-4">Страница не найдена</h2>
                <p className="text-lg mb-8">
                    Извините, мы не можем найти страницу, которую вы ищете.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/public" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        <Home size={20} />
                        На главную
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Назад
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
