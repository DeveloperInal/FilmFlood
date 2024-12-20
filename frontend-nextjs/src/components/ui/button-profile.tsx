"use client"
import { useState } from 'react'
import { useUserStore } from "@/stores/userData";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react"

const ButtonProfile = () => {
    const [isHovered, setIsHovered] = useState(false)
    const { logoutUser } = useUserStore()
    const router = useRouter()

    const handleLogout = () => {
        logoutUser()
        router.refresh()
    }

    return (
        <div className="relative inline-block">
            <button
                className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md transition-colors duration-200 hover:bg-primary/90"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                aria-haspopup="true"
                aria-expanded={isHovered}
            >
                <span className="text-lg" aria-hidden="true"><User/></span>
            </button>

            <div
                className={`absolute right-0 mt-2 w-48 bg-popover text-popover-foreground rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
                    isHovered ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
            >
                <div className="py-1">
                    <a
                        href='/profile'
                        className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                        role="menuitem"
                    >
                        Profile
                    </a>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center space-x-2"
                        role="menuitem"
                    >
                        <span className="text-sm" aria-hidden="true"><LogOut /></span>
                        <span>Log out</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ButtonProfile;
