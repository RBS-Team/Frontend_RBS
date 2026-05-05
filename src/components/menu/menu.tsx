import { LogIn, UserPlus, UserIcon, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {apiFetch} from "../../api/apiFetch";

// Определяем интерфейс пользователя
interface User {
    email?: string;
    [key: string]: any;
}

interface HeaderProps {
    onMasterRegisterClick?: () => void;
    onLoginClick?: () => void;
    user?: User | null; // Пользователь может быть null
    onProfileClick?: () => void;
    onLogout?: () => void;
}

export function Menu({ onLoginClick, user: initialUser, onProfileClick }: HeaderProps = {}) {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState<User | null | undefined>(initialUser);

    useEffect(() => {
        setCurrentUser(initialUser);
    }, [initialUser]);

    const onMasterRegClick = () => {
        navigate("/master/register");
    };

    const onSmartSearchClick = () => {
        navigate("/smart-search");
    };

    const onServiceClick = () => {
        navigate("/services");
    }

    const handleLogout = async () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        const res = await apiFetch("/logout", {method: "POST"});
        console.log(res)
        navigate("/");
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Логотип */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg"></div>
                        <span className="text-xl font-semibold">Okoshki</span>
                    </div>

                    {/* Навигация */}
                    <nav className="hidden md:flex items-center gap-8">
                        <button onClick={onServiceClick} className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer">
                            Услуги
                        </button>
                        <button onClick={onSmartSearchClick} className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer">
                            Умный поиск
                        </button>
                        <button onClick={onMasterRegClick} className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer">
                            Для специалистов
                        </button>
                    </nav>

                    {/* Блок авторизации */}
                    <div className="flex items-center gap-3">
                        {currentUser ? (
                            <>
                                <button
                                    onClick={onProfileClick}
                                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                >
                                    <UserIcon size={18} />
                                    {currentUser.id || 'Профиль'}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-50 cursor-pointer rounded-lg transition-colors"
                                >
                                    <LogOut size={18} />
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={onLoginClick}
                                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                                >
                                    <LogIn size={18} />
                                    Войти
                                </button>
                                <button
                                    onClick={onLoginClick}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    <UserPlus size={18} />
                                    Регистрация
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
