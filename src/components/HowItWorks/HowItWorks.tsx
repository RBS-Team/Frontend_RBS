import { Search, Calendar, CheckCircle, Star } from 'lucide-react';

export function HowItWorks() {
    const steps = [
        {
            icon: Search,
            title: 'Найдите мастера',
            description: 'Выберите специалиста по категории, рейтингу или местоположению',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Calendar,
            title: 'Выберите время',
            description: 'Забронируйте удобное время из доступных слотов',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: CheckCircle,
            title: 'Получите услугу',
            description: 'Приходите в назначенное время и наслаждайтесь результатом',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Star,
            title: 'Оставьте отзыв',
            description: 'Поделитесь впечатлениями и помогите другим в выборе',
            color: 'from-yellow-500 to-orange-500'
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="mb-4">Как это работает</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Всего 4 простых шага отделяют вас от идеального образа
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                                    <step.icon className="text-white" size={32} />
                                </div>
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full border-4 border-pink-500 flex items-center justify-center shadow-lg">
                                    <span className="text-pink-600 text-lg">{index + 1}</span>
                                </div>
                                <h3 className="text-center mb-3">{step.title}</h3>
                                <p className="text-gray-600 text-sm text-center leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-pink-300 to-purple-300 -translate-y-1/2"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
