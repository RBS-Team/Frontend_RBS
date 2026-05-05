import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, Star, Sparkles, ArrowRight, X, Check, Heart, Clock, Users, Image as ImageIcon } from 'lucide-react';

interface OnboardingProps {
    onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [floatingElements, setFloatingElements] = useState<Array<{ id: number; x: number; y: number }>>([]);

    useEffect(() => {
        const elements = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100
        }));
        setFloatingElements(elements);
    }, [currentStep]);

    const steps = [
        {
            icon: Search,
            title: 'Найдите идеального мастера',
            description: 'Более 10 000 проверенных специалистов по всей России. Фильтруйте по категории, рейтингу, цене и местоположению.',
            color: 'from-blue-500 to-cyan-500',
            accentColor: 'blue',
            illustration: (
                <div className="relative w-full h-80 flex items-center justify-center overflow-hidden">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 1, type: "spring", bounce: 0.5 }}
                        className="relative z-10"
                    >
                        <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl">
                            <Search className="text-white" size={72} />
                        </div>

                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-3xl blur-xl"
                        />
                    </motion.div>

                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                y: [0, -10, 0]
                            }}
                            transition={{
                                delay: 0.2 + i * 0.1,
                                duration: 0.6,
                                y: {
                                    duration: 2 + i * 0.3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }}
                            className="absolute"
                            style={{
                                top: `${50 + Math.sin((i * Math.PI * 2) / 8) * 35}%`,
                                left: `${50 + Math.cos((i * Math.PI * 2) / 8) * 35}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full"
                                />
                            </div>
                            <motion.div
                                animate={{ scale: [0, 1, 0] }}
                                transition={{ delay: i * 0.5, duration: 1.5, repeat: Infinity }}
                                className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                            >
                                <Check className="text-white" size={14} />
                            </motion.div>
                        </motion.div>
                    ))}

                    {floatingElements.slice(0, 5).map((el) => (
                        <motion.div
                            key={el.id}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0, 0.6, 0],
                                y: [-20, -60],
                                x: [0, (el.x - 50) * 0.5]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: el.id * 0.4
                            }}
                            className="absolute w-2 h-2 bg-blue-400 rounded-full"
                            style={{ left: `${el.x}%`, top: `${el.y}%` }}
                        />
                    ))}
                </div>
            )
        },
        {
            icon: Calendar,
            title: 'Выберите удобное время',
            description: 'Смотрите доступные слоты в реальном времени. Бронируйте запись онлайн 24/7 без звонков и ожиданий.',
            color: 'from-purple-500 to-pink-500',
            accentColor: 'purple',
            illustration: (
                <div className="relative w-full h-80 flex items-center justify-center">
                    <motion.div
                        initial={{ y: 100, opacity: 0, rotateX: 45 }}
                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="relative"
                    >
                        <div className="w-80 bg-white rounded-3xl shadow-2xl p-6 border-2 border-purple-100">
                            <div className="flex justify-between items-center mb-6">
                                <motion.h3
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-lg"
                                >
                                    Май 2026
                                </motion.h3>
                                <div className="flex gap-2">
                                    {[...Array(2)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.4 + i * 0.1 }}
                                            className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-2 mb-3">
                                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, i) => (
                                    <motion.div
                                        key={day}
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 + i * 0.05 }}
                                        className="text-center text-xs text-gray-500 py-2"
                                    >
                                        {day}
                                    </motion.div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-2">
                                {[...Array(35)].map((_, i) => {
                                    const isToday = i === 15;
                                    const isSelected = i === 18;
                                    const isPast = i < 10;

                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{
                                                scale: 1,
                                                rotate: 0,
                                                ...(isSelected && {
                                                    scale: [1, 1.1, 1],
                                                })
                                            }}
                                            transition={{
                                                delay: 0.6 + i * 0.02,
                                                scale: isSelected ? {
                                                    duration: 1,
                                                    repeat: Infinity
                                                } : {}
                                            }}
                                            className={`aspect-square rounded-xl flex items-center justify-center text-sm cursor-pointer transition-all ${
                                                isPast
                                                    ? 'bg-gray-50 text-gray-300'
                                                    : isSelected
                                                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                                                        : isToday
                                                            ? 'border-2 border-purple-500 text-purple-600 hover:bg-purple-50'
                                                            : 'bg-gray-50 hover:bg-purple-50 hover:text-purple-600'
                                            }`}
                                        >
                                            {i > 5 ? i - 5 : ''}
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: [0, 1.5, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                    className="absolute inset-0 bg-purple-400 rounded-xl opacity-50"
                                                />
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="absolute -right-6 top-1/2 -translate-y-1/2"
                        >
                            <div className="bg-white px-4 py-3 rounded-xl shadow-lg border-2 border-purple-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock size={16} className="text-purple-600" />
                                    <span className="text-sm">14:00</span>
                                </div>
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-xs text-gray-600"
                                >
                                    Доступно
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0.5, 1, 0.5],
                                y: [0, -30]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.3
                            }}
                            className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 opacity-20"
                            style={{
                                left: `${20 + i * 12}%`,
                                bottom: '10%'
                            }}
                        />
                    ))}
                </div>
            )
        },
        {
            icon: Star,
            title: 'Просмотрите портфолио',
            description: 'Оцените работы мастера перед записью. Реальные отзывы клиентов и подробные рейтинги помогут сделать правильный выбор.',
            color: 'from-amber-500 to-orange-500',
            accentColor: 'amber',
            illustration: (
                <div className="relative w-full h-80 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="relative"
                    >
                        <div className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200" />

                            <motion.div
                                animate={{
                                    backgroundPosition: ['0% 0%', '100% 100%']
                                }}
                                transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1))',
                                    backgroundSize: '20px 20px'
                                }}
                            />

                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{
                                    scale: 1,
                                    rotate: 0,
                                    y: [0, -5, 0]
                                }}
                                transition={{
                                    delay: 0.3,
                                    duration: 0.6,
                                    y: {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                }}
                                className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl z-10"
                            >
                                <Star className="text-white fill-white" size={48} />
                            </motion.div>

                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="absolute -bottom-3 -left-3 bg-white px-6 py-4 rounded-2xl shadow-2xl z-10"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ delay: 0.7 + i * 0.1 }}
                                            >
                                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                            </motion.div>
                                        ))}
                                    </div>
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.2 }}
                                        className="text-lg"
                                    >
                                        4.9
                                    </motion.span>
                                </div>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ delay: 1.3, duration: 0.6 }}
                                    className="text-xs text-gray-500"
                                >
                                    156 отзывов
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.8 }}
                                className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <ImageIcon size={16} className="text-purple-600" />
                                    <span className="text-sm">24 работы</span>
                                </div>
                            </motion.div>
                        </div>

                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1.5, 0],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.6
                                }}
                                className="absolute w-6 h-6"
                                style={{
                                    top: `${30 + i * 20}%`,
                                    right: `-${20 + i * 10}px`
                                }}
                            >
                                <Sparkles className="text-amber-400" />
                            </motion.div>
                        ))}
                    </motion.div>

                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0, 0.8, 0],
                                y: [0, -40],
                                x: [0, (Math.random() - 0.5) * 40]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.4
                            }}
                            className="absolute w-3 h-3 bg-amber-400 rounded-full"
                            style={{
                                left: `${20 + Math.random() * 60}%`,
                                top: `${80}%`
                            }}
                        />
                    ))}
                </div>
            )
        },
        {
            icon: Sparkles,
            title: 'Готовы начать?',
            description: 'Присоединяйтесь к 50 000+ довольных клиентов. Ваше преображение начинается прямо сейчас!',
            color: 'from-pink-500 via-purple-500 to-indigo-600',
            accentColor: 'pink',
            illustration: (
                <div className="relative w-full h-80 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1, type: "spring", bounce: 0.6 }}
                        className="relative"
                    >
                        <motion.div
                            animate={{
                                rotate: 360,
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                scale: { duration: 2, repeat: Infinity }
                            }}
                            className="w-48 h-48 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl"
                        >
                            <Sparkles className="text-white" size={96} />
                        </motion.div>

                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 rounded-full blur-xl"
                        />

                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    scale: [0, 1, 0],
                                    opacity: [0, 1, 0],
                                    x: [0, Math.cos((i * Math.PI * 2) / 12) * 120],
                                    y: [0, Math.sin((i * Math.PI * 2) / 12) * 120]
                                }}
                                transition={{
                                    delay: i * 0.15,
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 0.5
                                }}
                                className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-400 rounded-full -translate-x-1/2 -translate-y-1/2"
                            />
                        ))}
                    </motion.div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-8">
                        {[
                            { icon: Users, label: '10K+', text: 'Мастеров' },
                            { icon: Heart, label: '50K+', text: 'Записей' },
                            { icon: Star, label: '4.9', text: 'Рейтинг' }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 + i * 0.2 }}
                                className="bg-white rounded-2xl px-6 py-4 shadow-xl text-center"
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 10, -10, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3
                                    }}
                                    className="flex justify-center mb-2"
                                >
                                    <stat.icon className="text-purple-600" size={24} />
                                </motion.div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.8 + i * 0.2 }}
                                    className="text-2xl mb-1"
                                >
                                    {stat.label}
                                </motion.div>
                                <div className="text-xs text-gray-500">{stat.text}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    const currentStepData = steps[currentStep];

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-white z-[100] overflow-hidden">
            {floatingElements.map((el) => (
                <motion.div
                    key={el.id}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, (el.x - 50) * 2, 0],
                        opacity: [0, 0.3, 0]
                    }}
                    transition={{
                        duration: 8 + el.id,
                        repeat: Infinity,
                        delay: el.id * 0.5
                    }}
                    className="absolute w-2 h-2 bg-purple-300 rounded-full blur-sm"
                    style={{ left: `${el.x}%`, top: `${el.y}%` }}
                />
            ))}

            <motion.button
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                transition={{ type: "spring" }}
                onClick={handleSkip}
                className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-lg text-gray-400 hover:text-gray-600 transition-colors z-10 hover:shadow-xl"
            >
                <X size={24} />
            </motion.button>

            <div className="h-full flex flex-col items-center justify-center px-4 py-12 max-w-5xl mx-auto relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 100, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -100, scale: 0.9 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="w-full"
                    >
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-2xl border border-gray-100">
                            {currentStepData.illustration}
                        </div>

                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                                className={`w-20 h-20 bg-gradient-to-br ${currentStepData.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
                            >
                                <currentStepData.icon className="text-white" size={40} />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mb-4 text-3xl md:text-4xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                            >
                                {currentStepData.title}
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-600 max-w-xl mx-auto leading-relaxed text-lg"
                            >
                                {currentStepData.description}
                            </motion.p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="flex flex-col items-center gap-8 w-full max-w-md">
                    <div className="flex gap-3">
                        {steps.map((_, index) => (
                            <motion.button
                                key={index}
                                onClick={() => setCurrentStep(index)}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className="transition-all duration-300"
                            >
                                <motion.div
                                    animate={{
                                        width: index === currentStep ? 48 : 8
                                    }}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        index === currentStep
                                            ? `bg-gradient-to-r ${steps[index].color}`
                                            : index < currentStep
                                                ? 'bg-purple-300'
                                                : 'bg-gray-300'
                                    }`}
                                />
                            </motion.button>
                        ))}
                    </div>

                    <div className="flex gap-4 w-full">
                        {currentStep > 0 && (
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
                            >
                                Назад
                            </motion.button>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNext}
                            className={`${
                                currentStep === 0 ? 'w-full' : 'flex-1'
                            } px-8 py-4 bg-gradient-to-r ${currentStepData.color} text-white rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl group`}
                        >
                            <span className="text-lg">{currentStep === steps.length - 1 ? 'Начать' : 'Далее'}</span>
                            <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </motion.div>
                        </motion.button>
                    </div>

                    {currentStep < steps.length - 1 && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={handleSkip}
                            className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                        >
                            Пропустить введение
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
}
