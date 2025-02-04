import type React from "react"
import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

type ToastType = "success" | "error" | "info"

interface ToastProps {
    message: string
    type: ToastType
    onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onClose, 300) // Wait for fade out animation before calling onClose
        }, 5000)

        return () => clearTimeout(timer)
    }, [onClose])

    const getIcon = () => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case "error":
                return <AlertCircle className="w-5 h-5 text-red-500" />
            default:
                return <Info className="w-5 h-5 text-blue-500" />
        }
    }

    const getBackgroundColor = () => {
        switch (type) {
            case "success":
                return "bg-green-100"
            case "error":
                return "bg-red-100"
            default:
                return "bg-blue-100"
        }
    }

    return (
        <div
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center space-x-3 transition-all duration-300 ${getBackgroundColor()} ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-1rem]"
            }`}
        >
            {getIcon()}
            <span className="text-gray-800">{message}</span>
            <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}

export default Toast

