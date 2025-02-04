"use client"
import type React from "react"
import { useForm, type SubmitHandler } from "react-hook-form"

interface FormData {
    username: string
    email: string
    password: string
}

interface AuthStartFormProps {
    onSubmit: SubmitHandler<FormData>
    loading: boolean
}

const AuthStartForm: React.FC<AuthStartFormProps> = ({ onSubmit, loading }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>()

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <input
                    {...register("username", { required: "Username is required" })}
                    type="text"
                    placeholder="Username..."
                    className="flex h-10 w-full rounded-md border-purple-500 bg-white px-3 py-2 text-black text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>
            <div className="mb-4">
                <input
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                        },
                    })}
                    type="email"
                    placeholder="Email..."
                    className="flex h-10 w-full rounded-md border-purple-500 bg-white px-3 py-2 text-black text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
                <input
                    {...register("password", { required: "Password is required" })}
                    type="password"
                    placeholder="Password..."
                    className="flex h-10 w-full rounded-md border-purple-500 bg-white px-3 py-2 text-black text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <button
                type="submit"
                className="mt-4 w-full bg-black text-white py-2 px-4 rounded transition-colors duration-300 hover:bg-purple-400 focus:outline-none"
                disabled={loading}
            >
                {loading ? "Отправка..." : "Войти"}
            </button>
        </form>
    )
}

export default AuthStartForm

