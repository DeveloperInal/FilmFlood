import Link from 'next/link'
import { Icons } from "@/components/ui/icons"
import { Audiowide, Inter } from 'next/font/google'
import Image from "next/image"

const audiowide = Audiowide({
    weight: '400',
    subsets: ['latin']
})

const inter = Inter({
    weight: "500",
    subsets: ['latin']
})

const Sidebar = () => {
    return (
        <aside className="w-64 bg-black p-4 border-r border-red-600" style={audiowide.style}>
            <div className="flex items-center mb-8">
                <Link href="/">
                    <Image src='/logo.svg' alt="FilmFlood" width={120} height={120}/>
                </Link>
            </div>
            <div className="text-4xl font-bold mb-8 text-red-600" style={inter.style}>FilmFlood</div>
            <nav className="space-y-6">
                <NavItem icon={Icons.CategoriesFilm} label="Главная" to="/"/>
                <NavItem icon={Icons.Film} label="Фильмы" to="/film-category"/>
                <NavItem icon={Icons.Tv} label="Сериалы" to="/series-category"/>
                <NavItem icon={Icons.Video} label="Аниме" to="/anime-category"/>
                <NavItem icon={Icons.Sport} label="Спорт" to="/sports-category"/>
            </nav>
        </aside>
    )
}

function NavItem({icon: Icon, label, to}: {
    icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
    label: string;
    to: string
}) {
    return (
        <Link href={to} className="flex items-center space-x-3 text-white hover:text-red-500 transition-colors duration-200">
            <Icon className="w-6 h-6" />
            <span className="text-lg">{label}</span>
        </Link>
    )
}

export default Sidebar

