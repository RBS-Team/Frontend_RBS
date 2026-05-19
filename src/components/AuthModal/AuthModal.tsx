import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Sparkles } from 'lucide-react';
import {apiFetch} from "../../api/apiFetch";
import {hasErrors, validateAuthForm} from "../../utils/validation";
import {useToast} from "../../hooks/useToasts";
import {ToastContainer} from "../Toasts/Toasts";

interface AuthModalProps {
    onClose: () => void;
    onSuccess: (user: { id: string; role: string; name: string}) => void;
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

type AuthMode = 'login' | 'register';

export function AuthModal({ onClose, onSuccess, onShowToast }: AuthModalProps) {
    const [mode, setMode] = useState<AuthMode>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    });
    const toast = useToast();

    const validateForm = (): boolean => {
        const newErrors = validateAuthForm(formData, mode);
        setErrors(newErrors);
        return !hasErrors(newErrors);
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const url =
                mode === 'login'
                    ? '/login'
                    : '/client/register';

            const payload =
                mode !== 'login'
                    ? {
                        email: formData.email,
                        password: formData.password,
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        phone: formData.phone,
                    }
                    : {
                        email: formData.email,
                        password: formData.password,
                    };

            const res = await apiFetch(url, {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            const data = await res.data;

            if (!res.ok) {
                throw new Error(data.message || 'Ошибка запроса');
            }

            let usr: any = null;
            console.log(data)
            if (data.role === 'master') {
                const result = await apiFetch(`/masters/user/${data.id}`);
                usr = result.data;
            } else if (data.role === 'client') {
                const result = await apiFetch(`/clients/user/${data.user_id}`);
                usr = result.data;
            }

            onSuccess({
                id: data.user_id,
                role: data.role,
                name: `${usr.first_name} ${usr.last_name}`,
            });

            if (onShowToast) {
                onShowToast(
                    mode === 'login' ? 'Вы успешно вошли в систему!' : 'Регистрация прошла успешно!',
                    'success'
                );
            }

            onClose();

        } catch (err: any) {
            console.error(err.message);

            setErrors(prev => ({
                ...prev,
                email: err.message || 'Ошибка авторизации'
            }));

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
            >
                <div className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-8 text-white">
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    >
                        <X size={20} />
                    </motion.button>

                    <div className="flex items-center justify-center mb-4">
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                        >
                            <Sparkles size={32} />
                        </motion.div>
                    </div>

                    <h2 className="text-center text-2xl mb-2">
                        {mode === 'login' ? 'С возвращением!' : 'Присоединяйтесь к нам'}
                    </h2>
                    <p className="text-center text-white/80 text-sm">
                        {mode === 'login'
                            ? 'Войдите, чтобы записаться к мастеру'
                            : 'Создайте аккаунт и найдите своего мастера'}
                    </p>

                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
                </div>

                <div className="p-8 -mt-16 relative z-10">
                    <div className="bg-white rounded-2xl shadow-xl p-2 mb-6 flex">
                        <button
                            onClick={() => setMode('login')}
                            className="flex-1 relative py-3 rounded-xl transition-all"
                        >
                            <span className={`relative z-10 transition-colors ${
                                mode === 'login' ? 'text-white' : 'text-gray-600'
                            }`}>
                                Вход
                            </span>
                            {mode === 'login' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setMode('register')}
                            className="flex-1 relative py-3 rounded-xl transition-all"
                        >
                            <span className={`relative z-10 transition-colors ${
                                mode === 'register' ? 'text-white' : 'text-gray-600'
                            }`}>
                                Регистрация
                            </span>
                            {mode === 'register' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {mode === 'register' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Имя */}
                                    <label className="block text-sm text-gray-700 mb-2">Имя</label>
                                    <div className="relative mb-4">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <motion.input
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => updateField('firstName', e.target.value)}
                                            placeholder="Иван"
                                            className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                                                errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                            }`}
                                        />
                                        {errors.firstName && (
                                            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                                        )}
                                    </div>

                                    {/* Фамилия */}
                                    <label className="block text-sm text-gray-700 mb-2">Фамилия</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <motion.input
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => updateField('lastName', e.target.value)}
                                            placeholder="Иванов"
                                            className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                                                errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                            }`}
                                        />
                                        {errors.lastName && (
                                            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    placeholder="your@email.com"
                                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        <AnimatePresence mode="wait">
                            {mode === 'register' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <label className="block text-sm text-gray-700 mb-2">Телефон</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <motion.input
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => updateField('phone', e.target.value)}
                                            placeholder="+7 (900) 123-45-67"
                                            className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                                                errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                            }`}
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Пароль</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => updateField('password', e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-12 py-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                                        errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        {mode === 'login' && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-sm text-pink-600 hover:text-pink-700"
                                >
                                    Забыли пароль?
                                </button>
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                        >
                            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                        </motion.button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">или продолжить с</span>
                        </div>
                    </div>


                    {mode === 'login' ? (
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Нет аккаунта?{' '}
                            <button
                                onClick={() => setMode('register')}
                                className="text-pink-600 hover:text-pink-700 font-medium"
                            >
                                Зарегистрируйтесь
                            </button>
                        </p>
                    ) : (
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Уже есть аккаунт?{' '}
                            <button
                                onClick={() => setMode('login')}
                                className="text-pink-600 hover:text-pink-700 font-medium"
                            >
                                Войти
                            </button>
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}