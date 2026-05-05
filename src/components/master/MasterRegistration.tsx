import { useState } from 'react';
import { Upload, Check, ChevronRight } from 'lucide-react';
import {useNavigate} from "react-router-dom";




export function MasterRegistration() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialty: '',
        experience: '',
        description: '',
        city: '',
        address: ''
    });
    const navigate = useNavigate();


    const handleFinish = () => {
        navigate("/master/dashboard");
    };

    const specialties = [
        'Парикмахер',
        'Стилист-колорист',
        'Барбер',
        'Мастер маникюра',
        'Мастер педикюра',
        'Визажист',
        'Косметолог',
        'Бровист',
        'Массажист'
    ];

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="mb-8">
                        <h1 className="text-center mb-2">Регистрация мастера</h1>
                        <p className="text-center text-gray-600">Шаг {step} из 3</p>
                    </div>

                    <div className="flex gap-2 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`flex-1 h-2 rounded-full transition-colors ${
                                    i <= step ? 'bg-pink-500' : 'bg-gray-200'
                                }`}
                            />
                        ))}
                    </div>

                    {step === 1 && (
                        <div className="space-y-4">
                            <h3>Личная информация</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-2">Имя</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => updateField('firstName', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="Анна"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-2">Фамилия</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => updateField('lastName', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="Петрова"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="anna@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-2">Телефон</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="+7 (900) 123-45-67"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h3>Профессиональная информация</h3>
                            <div>
                                <label className="block text-sm mb-2">Специализация</label>
                                <select
                                    value={formData.specialty}
                                    onChange={(e) => updateField('specialty', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                >
                                    <option value="">Выберите специализацию</option>
                                    {specialties.map((spec) => (
                                        <option key={spec} value={spec}>
                                            {spec}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-2">Опыт работы (лет)</label>
                                <input
                                    type="number"
                                    value={formData.experience}
                                    onChange={(e) => updateField('experience', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="5"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-2">О себе</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-32"
                                    placeholder="Расскажите о себе, своих навыках и достижениях..."
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <h3>Местоположение</h3>
                            <div>
                                <label className="block text-sm mb-2">Город</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => updateField('city', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="Москва"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-2">Адрес студии/салона</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => updateField('address', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="ул. Тверская, д. 1"
                                />
                            </div>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-500 transition-colors cursor-pointer">
                                <Upload className="mx-auto mb-3 text-gray-400" size={32} />
                                <p className="text-sm text-gray-600 mb-1">Загрузите фото профиля</p>
                                <p className="text-xs text-gray-400">PNG, JPG до 5MB</p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 mt-8">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Назад
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (step < 3) {
                                    setStep(step + 1);
                                } else {
                                    handleFinish();
                                }
                            }}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            {step === 3 ? 'Завершить регистрацию' : 'Далее'}
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
