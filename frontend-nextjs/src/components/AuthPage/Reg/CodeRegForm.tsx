'use client';
import React, { useState } from "react";

interface CodeRegFormProps {
    onSubmit: (data: { code: number }) => void;
    loading: boolean;
}

const CodeRegForm: React.FC<CodeRegFormProps> = ({ onSubmit, loading }) => {
    const [code, setCode] = useState('');

    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit({ code: parseInt(code)});
    };

    return (
        <div className="flex items-center justify-center bg-white">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Введите код</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="flex h-10 w-full rounded-md border-purple-500 bg-white px-3 py-2 text-black text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        placeholder="Введите код"
                        value={code}
                        onChange={handleCodeChange}
                        autoComplete="one-time-code"
                    />
                    <button
                        type="submit"
                        className="mt-4 w-full bg-black text-white py-2 px-4 rounded transition-colors duration-300 hover:bg-purple-400 focus:outline-none"
                        disabled={loading}
                    >
                        {loading ? "Отправка..." : "Подтвердить"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CodeRegForm;