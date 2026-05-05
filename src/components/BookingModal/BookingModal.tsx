import { useState } from 'react';
import { X, Calendar, Clock, ChevronLeft, ChevronRight, Check, Star, Image as ImageIcon } from 'lucide-react';

interface BookingModalProps {
    masterName: string;
    masterImage: string;
    specialty: string;
    portfolio: string[];
    rating: number;
    reviews: number;
    onClose: () => void;
}

export function BookingModal({ masterName, masterImage, specialty, portfolio, rating, reviews, onClose }: BookingModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [selectedService, setSelectedService] = useState<string>('');
    const [selectedPortfolioImage, setSelectedPortfolioImage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'portfolio' | 'booking'>('portfolio');

    const services = [
        {
            id: '1',
            name: 'Стрижка',
            duration: '60 мин',
            price: 3500,
            availableDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
        },
        {
            id: '2',
            name: 'Окрашивание',
            duration: '120 мин',
            price: 8000,
            availableDays: ['Пн', 'Ср', 'Пт']
        },
        {
            id: '3',
            name: 'Укладка',
            duration: '45 мин',
            price: 2500,
            availableDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
        },
        {
            id: '4',
            name: 'Стрижка + Укладка',
            duration: '90 мин',
            price: 5500,
            availableDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт']
        }
    ];

    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
        '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
    ];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const weekDaysShort = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    const goToPreviousMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    };

    const selectDay = (day: number) => {
        const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
        if (newDate >= today) {
            setSelectedDate(newDate);
        }
    };

    const isDayAvailableForService = (date: Date) => {
        if (!selectedService) return true;
        const service = services.find(s => s.id === selectedService);
        if (!service) return true;
        const dayName = weekDaysShort[date.getDay()];
        return service.availableDays.includes(dayName);
    };

    const selectedServiceData = services.find(s => s.id === selectedService);
    const canBook = selectedService && selectedTime;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2>Запись к мастеру</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                        <img
                            src={masterImage}
                            alt={masterName}
                            className="w-20 h-20 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <h3>{masterName}</h3>
                            <p className="text-gray-600">{specialty}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1">
                                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm">{rating}</span>
                                </div>
                                <span className="text-gray-400 text-sm">({reviews} отзывов)</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-6 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('portfolio')}
                            className={`px-6 py-3 relative transition-colors ${
                                activeTab === 'portfolio'
                                    ? 'text-pink-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
              <span className="flex items-center gap-2">
                <ImageIcon size={18} />
                Портфолио
              </span>
                            {activeTab === 'portfolio' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('booking')}
                            className={`px-6 py-3 relative transition-colors ${
                                activeTab === 'booking'
                                    ? 'text-pink-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
              <span className="flex items-center gap-2">
                <Calendar size={18} />
                Запись
              </span>
                            {activeTab === 'booking' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"></div>
                            )}
                        </button>
                    </div>

                    {activeTab === 'portfolio' ? (
                        <div>
                            <h3 className="mb-4">Работы мастера ({portfolio.length})</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                                {portfolio.map((image, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedPortfolioImage(image)}
                                        className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-md hover:shadow-lg"
                                    >
                                        <img
                                            src={image}
                                            alt={`Работа ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setActiveTab('booking')}
                                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                            >
                                Записаться к мастеру
                            </button>
                        </div>
                    ) : (
                        <div>

                            <div className="mb-8">
                                <h3 className="mb-4">Выберите услугу</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {services.map((service) => (
                                        <div
                                            key={service.id}
                                            onClick={() => {
                                                setSelectedService(service.id);
                                                setSelectedTime('');
                                            }}
                                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                                selectedService === service.id
                                                    ? 'border-pink-500 bg-pink-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-medium">{service.name}</span>
                                                {selectedService === service.id && (
                                                    <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                                                        <Check size={14} className="text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                <span>{service.duration}</span>
                                                <span>{service.price} ₽</span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Доступно: {service.availableDays.join(', ')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {selectedService && (
                                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            💡 В календаре отображаются только доступные дни для выбранной услуги
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="mb-4 flex items-center gap-2">
                                        <Calendar size={20} />
                                        Выберите дату
                                    </h3>
                                    <div className="border border-gray-200 rounded-xl p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <button
                                                onClick={goToPreviousMonth}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <span className="font-medium">
                    {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                  </span>
                                            <button
                                                onClick={goToNextMonth}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-7 gap-2">
                                            {weekDays.map((day) => (
                                                <div key={day} className="text-center text-sm text-gray-500 py-2">
                                                    {day}
                                                </div>
                                            ))}
                                            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                                                <div key={`empty-${index}`} />
                                            ))}
                                            {Array.from({ length: daysInMonth }).map((_, index) => {
                                                const day = index + 1;
                                                const dayDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                                                dayDate.setHours(0, 0, 0, 0);
                                                const isToday = dayDate.getTime() === today.getTime();
                                                const isSelected = dayDate.getTime() === selectedDate.getTime();
                                                const isPast = dayDate < today;
                                                const isServiceAvailable = isDayAvailableForService(dayDate);
                                                const isDisabled = isPast || !isServiceAvailable;

                                                return (
                                                    <button
                                                        key={day}
                                                        onClick={() => !isDisabled && selectDay(day)}
                                                        disabled={isDisabled}
                                                        className={`aspect-square rounded-lg text-sm transition-all ${
                                                            isDisabled
                                                                ? 'text-gray-300 cursor-not-allowed'
                                                                : isSelected
                                                                    ? 'bg-pink-500 text-white'
                                                                    : isToday
                                                                        ? 'border-2 border-pink-500 text-pink-500'
                                                                        : 'hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {day}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-4 flex items-center gap-2">
                                        <Clock size={20} />
                                        Выберите время
                                    </h3>
                                    <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
                                        {timeSlots.map((time) => {
                                            const isBooked = Math.random() > 0.7;
                                            return (
                                                <button
                                                    key={time}
                                                    onClick={() => !isBooked && setSelectedTime(time)}
                                                    disabled={isBooked}
                                                    className={`py-3 px-2 rounded-lg text-sm transition-all ${
                                                        isBooked
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : selectedTime === time
                                                                ? 'bg-pink-500 text-white'
                                                                : 'border border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                                                    }`}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {canBook && selectedServiceData && (
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                        <h4 className="mb-3">Детали записи</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Услуга:</span>
                                                <span>{selectedServiceData.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Дата:</span>
                                                <span>
                      {selectedDate.toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                      })}
                    </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Время:</span>
                                                <span>{selectedTime}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Продолжительность:</span>
                                                <span>{selectedServiceData.duration}</span>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t border-gray-200">
                                                <span>Итого:</span>
                                                <span className="text-lg">{selectedServiceData.price} ₽</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity">
                                        Подтвердить запись
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {selectedPortfolioImage && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4"
                    onClick={() => setSelectedPortfolioImage(null)}
                >
                    <button
                        onClick={() => setSelectedPortfolioImage(null)}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-white" />
                    </button>
                    <img
                        src={selectedPortfolioImage}
                        alt="Работа мастера"
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
