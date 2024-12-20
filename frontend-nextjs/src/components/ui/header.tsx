import { Button } from "@/components/ui/button";
import { Audiowide } from 'next/font/google';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userData";
import { Film, User, LogOut } from 'lucide-react';
import { DynamicMovieSearch } from "@/components/ui/dynamicInput/dynamic_input";

const audiowide = Audiowide({
    weight: '400',
    subsets: ['latin']
});

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false); // Управление видимостью меню
    const router = useRouter();
    const { logoutUser } = useUserStore()

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsAuthenticated(!!token); // Устанавливаем true, если токен есть
    }, []);

    const handleProfileClick = () => {
        router.push('/profile'); // Перенаправление на профиль
        setMenuVisible(false); // Закрыть меню
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken'); // Удаляем токен
        setIsAuthenticated(false); // Обновляем состояние
        logoutUser(); // Выход из системы
        setMenuVisible(false); // Закрыть меню
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible); // Переключить видимость меню
    };

    const handleAuthClick = () => {
        router.push('/auth');
    };

    return (
        <header className="bg-red-800 p-4 relative z-20" style={audiowide.style}>
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-2">
                    <Film className="h-8 w-8 text-white" />
                    <h1 className="text-2xl font-bold text-white">FilmFlood</h1>
                </div>
                <div className="w-full md:w-1/3 max-w-md">
                    <DynamicMovieSearch />
                </div>
                <div className="relative flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <Button
                                onClick={toggleMenu}
                                variant="outline"
                                className="rounded-full text-white border-white hover:border-red-600 bg-black hover:text-red-600 flex items-center space-x-2"
                            >
                                <User className="h-4 w-4" />
                                <span>Аккаунт</span>
                            </Button>
                            {menuVisible && (
                                <div className="absolute top-12 right-0 bg-zinc-900 text-white rounded-lg shadow-lg p-4 flex flex-col space-y-2 w-48">
                                    <Button
                                        onClick={handleProfileClick}
                                        variant="ghost"
                                        className="flex items-center space-x-2 text-left hover:bg-zinc-800"
                                    >
                                        <User className="h-4 w-4" />
                                        <span>Профиль</span>
                                    </Button>
                                    <Button
                                        onClick={handleLogout}
                                        variant="ghost"
                                        className="flex items-center space-x-2 text-left hover:bg-zinc-800 text-red-500"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Выйти</span>
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <Button
                            onClick={handleAuthClick}
                            variant="outline"
                            className="rounded-full text-white border-white hover:border-red-600 bg-black hover:text-red-600"
                        >
                            Войти / Регистрация
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
