import { useState } from "react"
import Toast from "@/components/ui/toast"

export function useToast() {
    const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: "success" | "error" | "info" }>>([])

    const addToast = (message: string, type: "success" | "error" | "info") => {
        const newToast = { id: Date.now(), message, type }
        setToasts((prevToasts) => [...prevToasts, newToast])
    }

    const removeToast = (id: number) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }

    const toastComponents = toasts.map((toast) => (
        <Toast
            key={toast.id}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
            type={toast.type}
        />
    ))

    return { addToast, toastComponents }
}