'use client'
import React, { useState } from "react";

interface AuthStartFormProps {
    onSubmit: (data: { username: string; email: string; password: string }) => void;
    loading: boolean;
}

const AuthStartForm: React.FC<AuthStartFormProps> = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Username..."
                    className="flex h-10 w-full rounded-md border-purple-500 bg-white px-3 py-2 text-black text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={formData.username}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-4">
                <input
                    type="email"
                    name="email"
                    placeholder="Email..."
                    className="flex h-10 w-full rounded-md border-purple-500 bg-white px-3 py-2 text-black text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-4">
                <input
                    type="password"
                    name="password"
                    placeholder="Password..."
                    className="flex h-10 w-full rounded-md border-purple-500 bg-white px-3 py-2 text-black text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>
            <button
                type="submit"
                className="mt-4 w-full bg-black text-white py-2 px-4 rounded transition-colors duration-300 hover:bg-purple-400 focus:outline-none"
                disabled={loading}
            >
                {loading ? "Отправка..." : "Войти"}
            </button>
        </form>
    );
}

export default AuthStartForm;