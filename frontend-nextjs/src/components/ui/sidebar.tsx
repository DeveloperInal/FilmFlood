"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import Image  from "next/legacy/image"
import { useEffect, useState } from "react"
import { Audiowide } from "next/font/google"
import { Film, Home, Menu, Tv, X } from "lucide-react"

const audiowide = Audiowide({
    weight: "400",
    subsets: ["latin"],
})

interface INavItem {
    icon: any
    label: string
    to: string
}

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    const toggleMenu = () => setIsOpen(!isOpen)

    return (
        <div className={audiowide.className}>
            <motion.aside
                initial={isMobile ? { width: "60px" } : { width: "250px" }}
                animate={isMobile && !isOpen ? { width: "60px" } : { width: "250px" }}
                transition={{ duration: 0.3 }}
                className="fixed left-0 top-0 h-full bg-gray-900 text-white z-50 overflow-hidden"
            >
                <div className="h-full flex flex-col items-center">
                    <Link href="/" className="mt-4 mb-8">
                        <div className="relative w-12 h-12 md:w-20 md:h-20">
                            <Image src="/logo.svg" alt="FilmFlood" layout="fill" className="rounded-full" />
                        </div>
                    </Link>
                    <nav className="flex flex-col items-start space-y-8 w-full">
                        <NavItem icon={Home} label="Главная" to="/" />
                        <NavItem icon={Film} label="Фильмы" to="/film-category" />
                        <NavItem icon={Tv} label="Сериалы" to="/series-category" />
                    </nav>
                    {isMobile && (
                        <button
                            onClick={toggleMenu}
                            className="mt-auto mb-2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    )}
                </div>
            </motion.aside>
            <div className="relative pl-[60px] md:pl-[250px] min-h-screen bg-blue-500" />
        </div>
    )
}

const NavItem = ({ icon: Icon, label, to }: INavItem) => (
    <Link
        href={to}
        className="group w-full px-4 py-2 flex items-center justify-start hover:bg-gray-800 transition-colors duration-200"
    >
        <div className="relative flex items-center">
            <Icon size={24} className="text-blue-400 group-hover:text-blue-300 transition-colors duration-200" />
            <div className="absolute inset-0 bg-blue-400 opacity-20 blur-sm rounded-full group-hover:opacity-40 transition-opacity duration-200"></div>
        </div>
        <span className="ml-4 text-sm md:text-lg text-white whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
    </Link>
)

export default Sidebar

