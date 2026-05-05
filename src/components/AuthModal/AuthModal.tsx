import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Sparkles } from 'lucide-react';
import {apiFetch} from "../../api/apiFetch";

interface AuthModalProps {
    onClose: () => void;
    onSuccess: (user: { id: string; email: string }) => void;
}

type AuthMode = 'login' | 'register';

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
    const [mode, setMode] = useState<AuthMode>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const url = mode === 'login'
                ? '/client/login'
                : '/client/register';

            const payload =  mode !== 'login' ?{
                        email: formData.email,
                        password: formData.password,
                        role: "client"
                    } :
                {email: formData.email,
                password: formData.password
                } ;

            const res = await apiFetch(url, {
                method: 'POST',
                body: JSON.stringify(payload),
            });




            if (!res.ok) {
                const data = await res.data;
                throw new Error(data.message || 'Ошибка запроса');
            }

            const data = await res.data;


            onSuccess({
                id: data.id,
                email: data.email,
            });

            onClose();
        } catch (err: any) {
            setError(err.message);
            console.error(err.message);
        } finally {
            setLoading(false);
            console.log(mode === 'login');
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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
                                    <label className="block text-sm text-gray-700 mb-2">Имя</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <motion.input
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => updateField('name', e.target.value)}
                                            placeholder="Иван Иванов"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
                                        />
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
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
                                />
                            </div>
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
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
                                        />
                                    </div>
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
                                    required
                                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
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
                            disabled={loading}
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                        >
                            {loading
                                ? 'Загрузка...'
                                : mode === 'login'
                                    ? 'Войти'
                                    : 'Зарегистрироваться'}
                        </motion.button>
                    </form>



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
