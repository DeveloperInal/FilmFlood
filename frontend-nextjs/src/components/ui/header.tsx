"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {Film, User, LogOut, Menu, X, UserCog, Star} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/stores/userData"
import { DynamicMovieSearch } from "@/components/ui/dynamicInput/dynamic_input"
import { Audiowide } from "next/font/google"

const audiowide = Audiowide({
    weight: "400",
    subsets: ["latin"],
})

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [menuVisible, setMenuVisible] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter()
    const { logoutUser } = useUserStore()

    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        setIsAuthenticated(!!token)
    }, [])

    const handleProfileClick = () => {
        router.push("/profile")
        setMenuVisible(false)
        setMobileMenuOpen(false)
    }

    const handleLogout = () => {
        localStorage.removeItem("accessToken")
        setIsAuthenticated(false)
        logoutUser()
        setMenuVisible(false)
        setMobileMenuOpen(false)
    }

    const toggleMenu = () => setMenuVisible(!menuVisible)
    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

    const handleAuthClick = () => {
        router.push("/auth")
        setMobileMenuOpen(false)
    }

    return (
        <header className="bg-gray-900 border-b border-blue-500 shadow-lg" style={audiowide.style}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <Film className="h-8 w-8 text-blue-400" />
                        <h1 className="text-2xl font-bold text-white">
                            Film<span className="text-blue-400">Flood</span>
                        </h1>
                    </div>
                    <div className="hidden md:block w-1/3 max-w-md">
                        <DynamicMovieSearch />
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="relative">
                                <Button
                                    onClick={toggleMenu}
                                    variant="outline"
                                    className="rounded-full text-blue-400 border-blue-400 hover:bg-blue-900 hover:text-blue-300 transition-colors duration-200"
                                >
                                    <User className="h-4 w-4 mr-2" />
                                    <span>Аккаунт</span>
                                </Button>
                                <AnimatePresence>
                                    {menuVisible && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-12 right-0 bg-gray-800 rounded-lg shadow-lg p-2 flex flex-col space-y-2 w-48 border border-blue-500"
                                        >
                                            <Button
                                                onClick={handleProfileClick}
                                                variant="ghost"
                                                className="flex items-center space-x-2 text-left hover:bg-blue-900 text-blue-400"
                                            >
                                                <UserCog className="h-4 w-4" />
                                                <span>Профиль</span>
                                            </Button>
                                            <Button
                                                onClick={handleLogout}
                                                variant="ghost"
                                                className="flex items-center space-x-2 text-left hover:bg-blue-900 text-red-400"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Выйти</span>
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Button
                                onClick={handleAuthClick}
                                variant="outline"
                                className="rounded-full text-blue-400 border-blue-400 hover:bg-blue-900 hover:text-blue-300 transition-colors duration-200"
                            >
                                Войти / Регистрация
                            </Button>
                        )}
                    </div>
                    <div className="md:hidden">
                        <Button
                            onClick={toggleMobileMenu}
                            variant="ghost"
                            className="text-blue-400 hover:bg-blue-900 transition-colors duration-200"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden py-4"
                        >
                            <DynamicMovieSearch />
                            <div className="mt-4 space-y-2">
                                {isAuthenticated ? (
                                    <>
                                        <Button
                                            onClick={handleProfileClick}
                                            variant="ghost"
                                            className="w-full justify-start text-blue-400 hover:bg-blue-900 transition-colors duration-200"
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            Профиль
                                        </Button>
                                        <Button
                                            onClick={handleLogout}
                                            variant="ghost"
                                            className="w-full justify-start text-red-400 hover:bg-blue-900 transition-colors duration-200"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Выйти
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        onClick={handleAuthClick}
                                        variant="outline"
                                        className="w-full text-blue-400 border-blue-400 hover:bg-blue-900 hover:text-blue-300 transition-colors duration-200"
                                    >
                                        Войти / Регистрация
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    )
}

export default Header

