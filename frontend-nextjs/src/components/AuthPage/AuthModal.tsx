'use client'
import { NextPage } from "next";
import { useUserStore } from "@/stores/userData";
import React, { useState, useEffect } from "react";
import RegStartForm from "@/components/AuthPage/Reg/RegisterStartForm";
import CodeRegForm from "@/components/AuthPage/Reg/CodeRegForm";
import AuthStartForm from "@/components/AuthPage/Auth/AuthStartForm";
import CodeAuthForm from "@/components/AuthPage/Auth/CodeAuthForm";
import { useRouter } from "next/navigation";

interface AuthModalProps {
    onClose?: () => void;
}

const AuthModal: NextPage<AuthModalProps> = ({ onClose }) => {
    const { createUser, authUser, verifyUser, verifyEmail, loading } = useUserStore()
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState('reg'); // 'login', 'register', 'code', 'success'

    const handleLoginStartSubmit = async (data: { username: string, email: string, password: string}) => {
        try {
            await createUser(data.username, data.email, data.password);
            console.log(data.username, data.email, data.password);
            setCurrentStep('code-reg');
        } catch (error) {
            console.error("User creation failed:", error);
        }
    };

    const handleLoginCodeSumbit = async (data: { code: number }) => {
        try {
            await verifyEmail(data.code);
            setCurrentStep('success-reg');
        } catch (error) {
            console.error("User creation failed:", error);
        }
    }

    const handleStartAuthSubmit = async (data: { username: string, email: string, password: string}) => {
        try {
            await authUser(data.username, data.email, data.password);
            console.log(data.username, data.email, data.password);
            setCurrentStep('code-auth');
        } catch (error) {
            console.error("User creation failed:", error);
        }
    }

    const handleCodeAuthSubmit = async (data: { code: number }) => {
        try {
            await verifyUser(data.code);
            setCurrentStep('success-auth');
        } catch (error) {
            console.error("User creation failed:", error);
            console.error("Error response:", error.response);
        }
    };

    useEffect(() => {
        if (currentStep === 'success-auth' || currentStep === 'success-reg') {
            router.push('/'); // Перенаправление на главную страницу после успешной авторизации
        }
    }, [currentStep, router]);

    const renderForm = () => {
        switch (currentStep) {
            case 'reg':
                return <RegStartForm onSubmit={handleLoginStartSubmit} loading={loading} />;
            case 'auth':
                return <AuthStartForm onSubmit={handleStartAuthSubmit} loading={loading} />;
            case 'code-reg':
                return <CodeRegForm onSubmit={handleLoginCodeSumbit} loading={loading} />;
            case 'code-auth':
                return <CodeAuthForm onSubmit={handleCodeAuthSubmit} loading={loading} />;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                <h1 className="text-2xl font-bold mb-4 text-center text-black">
                    {currentStep === 'auth' ? 'Авторизация' : currentStep === 'reg' ? 'Регистрация' : 'Подтверждение'}
                </h1>
                {renderForm()}
                <div className="mt-4 text-center">
                    {currentStep === 'auth' && (
                        <a className="text-blue-500 hover:underline" onClick={() => setCurrentStep('reg')}>
                            Нет аккаунта? Зарегистрироваться
                        </a>
                    )}
                    {currentStep === 'reg' && (
                        <a className="text-blue-500 hover:underline" onClick={() => setCurrentStep('auth')}>
                            Уже есть аккаунт? Войти
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AuthModal;