import { useEffect, useState } from 'react';
import {X, Calendar, Clock, ChevronLeft, ChevronRight, Check, Star, Image as ImageIcon, MapPin} from 'lucide-react';
import { apiFetch } from "../../api/apiFetch";

interface PortfolioItem {
    id: string;
    master_id: string;
    url: string;
}

// Интерфейс для услуг из реального API
interface RealService {
    id: string;
    title: string;
    duration: number | string;
    price: number;
    address?: string;
    duration_minutes?: number;
    name?: string;
}

// Интерфейс ответа доступных слотов
type AvailableSlotsResponse = {
    slots: {
        [date: string]: string[];
    }
};

// Интерфейс для создания записи
interface CreateAppointmentRequest {
    client_comment: string;
    service_id: string;
    start_at: string; // Формат: "YYYY-MM-DD HH:MM" или ISO
}

interface BookingModalProps {
    master: any;
    onClose: () => void;
    onSuccess?: () => void; // Колбэк при успешной записи
}

export function BookingModal({ master, onClose, onSuccess }: BookingModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [selectedService, setSelectedService] = useState<string>('');
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [activeTab, setActiveTab] = useState<'portfolio' | 'booking'>('portfolio');
    const [clientComment, setClientComment] = useState<string>('');

    // Состояния для хранения реальных данных из API и индикаторов загрузки
    const [realServices, setRealServices] = useState<RealService[]>([]);
    const [apiSlots, setApiSlots] = useState<AvailableSlotsResponse['slots']>({});

    const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Вспомогательная функция для форматирования Date в строку YYYY-MM-DD
    const formatDateString = (date: Date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().split('T')[0];
    };

    // Форматирование даты и времени для отправки на сервер в формате "YYYY-MM-DD HH:MM"
    const formatDateTimeForApi = (date: Date, time: string) => {
        const dateStr = formatDateString(date); // Уже есть функция, возвращает "YYYY-MM-DD"
        return `${dateStr} ${time}`; // Просто соединяем дату и время
    };


    // 1. Получение списка реальных услуг мастера
    useEffect(() => {
        if (!master?.id) return;
        apiFetch(`/masters/${master.id}/services`)
            .then(res => {
                if (res.ok) {
                    const items = res.data?.items || res.data;
                    setRealServices(Array.isArray(items) ? items : []);
                } else {
                    console.error(res);
                }
            })
            .catch(console.error);
    }, [master.id]);

    // 2. Получение портфолио
    useEffect(() => {
        if (!master?.id) return;
        apiFetch(`/masters/${master.id}/portfolio`)
            .then((res) => {
                if (res.ok) {
                    const items = res.data.items || res.data;
                    setPortfolio(Array.isArray(items) ? items : []);
                } else {
                    console.error(res);
                }
            })
            .catch(console.error);
    }, [master.id]);

    // 3. Динамическая загрузка доступных слотов при смене услуги или месяца в календаре
    useEffect(() => {
        if (!selectedService) {
            setApiSlots({});
            return;
        }

        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        setLoadingSlots(true);
        setError(null);

        const queryParams = new URLSearchParams({
            service_id: selectedService,
            start_date: formatDateString(firstDayOfMonth),
            end_date: formatDateString(lastDayOfMonth)
        }).toString();

        apiFetch(`/available-slots?${queryParams}`)
            .then((res) => {
                if (res.ok) {
                    setApiSlots(res.data?.slots || {});
                } else {
                    console.error(res);
                    setError('Не удалось загрузить доступные слоты');
                }
            })
            .catch(console.error)
            .finally(() => setLoadingSlots(false));
    }, [selectedService, selectedDate.getFullYear(), selectedDate.getMonth()]);

    // Сброс выбранного времени при изменении выбранного дня в календаре
    const selectDay = (day: number) => {
        const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
        if (newDate >= today) {
            setSelectedDate(newDate);
            setSelectedTime('');
            setError(null);
        }
    };

    // Поиск слотов для конкретного отрендеренного дня в календаре
    const getSlotsForDate = (date: Date) => {
        const formatted = formatDateString(date);
        return apiSlots[formatted] || [];
    };

    // Проверка, есть ли вообще доступные слоты на этот день (для стилизации календаря)
    const isDayAvailableForService = (date: Date) => {
        if (!selectedService) return true;
        return getSlotsForDate(date).length > 0;
    };

    // Получение списка слотов времени для текущего выбранного дня
    const currentTimeSlots = getSlotsForDate(selectedDate);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        return {
            daysInMonth: lastDay.getDate(),
            startingDayOfWeek: firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
        };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    const weekDaysShort = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const goToPreviousMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
        setSelectedTime('');
        setError(null);
    };

    const goToNextMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
        setSelectedTime('');
        setError(null);
    };

    const selectedServiceData = realServices.find(s => s.id === selectedService);
    const canBook = selectedService && selectedTime;

    // Обработчик создания записи
    const handleSubmitBooking = async () => {
        if (!canBook || !selectedServiceData) return;

        setSubmitting(true);
        setError(null);

        try {
            const startAt = formatDateTimeForApi(selectedDate, selectedTime);

            const requestData: CreateAppointmentRequest = {
                client_comment: clientComment.trim() || "Запись через приложение",
                service_id: selectedService,
                start_at: startAt
            };

            const response = await apiFetch('/appointments', {
                method: 'POST',
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                if (onSuccess) {
                    onSuccess();
                }
                onClose();
            } else {
                const errorMessage = response.data?.message || response.data?.error || 'Не удалось создать запись';
                setError(errorMessage);
                console.error('Booking error:', response);
            }
        } catch (err) {
            console.error('Network error:', err);
            setError('Ошибка сети. Пожалуйста, проверьте соединение и попробуйте снова.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Шапка модального окна */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-20">
                    <h2 className="text-xl font-bold">Запись к мастеру</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Профиль мастера */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                        <img src={master.avatar_url} alt={master.name} className="w-20 h-20 rounded-full object-cover" />
                        <div className="flex-1">
                            <h3 className="text-lg font-bold">{master.name}</h3>
                            <p className="text-gray-600 text-sm">{master.bio}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1">
                                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">{master.rating}</span>
                                </div>
                                <span className="text-gray-400 text-sm">({master.review_count} отзывов)</span>
                            </div>
                        </div>
                    </div>

                    {/* Табы */}
                    <div className="flex gap-2 mb-6 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('portfolio')}
                            className={`px-6 py-3 relative font-medium transition-colors ${activeTab === 'portfolio' ? 'text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <span className="flex items-center gap-2"><ImageIcon size={18} />Портфолио</span>
                            {activeTab === 'portfolio' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('booking')}
                            className={`px-6 py-3 relative font-medium transition-colors ${activeTab === 'booking' ? 'text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <span className="flex items-center gap-2"><Calendar size={18} />Запись</span>
                            {activeTab === 'booking' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"></div>}
                        </button>
                    </div>

                    {activeTab === 'portfolio' ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {portfolio.map((item) => (
                                <img key={item.id} src={item.url} alt="Работа мастера" className="w-full h-48 object-cover rounded-xl shadow-sm" />
                            ))}
                            {portfolio.length === 0 && <p className="text-gray-500 col-span-full text-center py-8">Фотографии портфолио отсутствуют</p>}
                        </div>
                    ) : (
                        /* Секция Записи (Booking) */
                        <div className="space-y-6">
                            {/* Выбор реальной услуги */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-3">1. Выберите услугу</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {realServices.map((service) => (
                                        <button
                                            key={service.id}
                                            onClick={() => {
                                                setSelectedService(service.id);
                                                setSelectedTime('');
                                                setError(null);
                                            }}
                                            className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                                                selectedService === service.id
                                                    ? 'border-pink-500 bg-pink-50/50 ring-1 ring-pink-500'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div>
                                                <p className="font-semibold text-gray-900">{service.title}</p>
                                                <p className="text-xs text-gray-500">{service.duration_minutes || service.duration} мин</p>
                                                {service.address && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <MapPin size={14} className="text-gray-500 shrink-0" />
                                                        <p className="text-xs text-gray-500 truncate">{service.address}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="font-bold text-pink-600">{service.price} ₽</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Сетка: Интерактивный Календарь и Слоты Времени */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                {/* Блок Календаря */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-sm font-bold text-gray-900">2. Выберите дату</h4>
                                        <div className="flex gap-1">
                                            <button onClick={goToPreviousMonth} className="p-1 hover:bg-gray-100 rounded-lg"><ChevronLeft size={20} /></button>
                                            <span className="text-sm font-semibold px-2 self-center">{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</span>
                                            <button onClick={goToNextMonth} className="p-1 hover:bg-gray-100 rounded-lg"><ChevronRight size={20} /></button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 font-medium text-gray-400">
                                        {weekDaysShort.map(d => <div key={d} className="py-1">{d}</div>)}
                                    </div>

                                    <div className="grid grid-cols-7 gap-1">
                                        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                                            <div key={`empty-${i}`} />
                                        ))}
                                        {Array.from({ length: daysInMonth }).map((_, i) => {
                                            const day = i + 1;
                                            const currentCheckDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                                            const isPast = currentCheckDate < today;
                                            const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentCheckDate.getMonth();
                                            const hasSlots = isDayAvailableForService(currentCheckDate);

                                            return (
                                                <button
                                                    key={day}
                                                    disabled={isPast || (selectedService !== '' && !hasSlots)}
                                                    onClick={() => selectDay(day)}
                                                    className={`py-2 text-sm rounded-lg font-medium transition-all ${
                                                        isSelected
                                                            ? 'bg-pink-500 text-white shadow-sm'
                                                            : isPast
                                                                ? 'text-gray-300 cursor-not-allowed'
                                                                : selectedService && !hasSlots
                                                                    ? 'text-gray-300 bg-gray-50/50 cursor-not-allowed line-through'
                                                                    : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Блок Слотов Времени */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-1.5">
                                        <Clock size={16} />
                                        3. Доступное время
                                    </h4>

                                    {!selectedService ? (
                                        <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                                            Сначала выберите услугу из списка выше.
                                        </p>
                                    ) : loadingSlots ? (
                                        <p className="text-sm text-gray-400 py-4 text-center">Загрузка свободных слотов...</p>
                                    ) : currentTimeSlots.length === 0 ? (
                                        <p className="text-sm text-gray-400 bg-gray-50 p-4 rounded-xl text-center">
                                            Нет свободного времени на выбранный день.
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1">
                                            {currentTimeSlots.map((time) => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`py-2 px-3 text-sm rounded-xl font-medium border transition-all ${
                                                        selectedTime === time
                                                            ? 'bg-pink-500 text-white border-pink-500 shadow-sm'
                                                            : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                                                    }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Поле для комментария клиента */}
                            {canBook && (
                                <div className="pt-4">
                                    <label htmlFor="clientComment" className="text-sm font-medium text-gray-700 mb-2 block">
                                        4. Комментарий к записи (необязательно)
                                    </label>
                                    <textarea
                                        id="clientComment"
                                        value={clientComment}
                                        onChange={(e) => setClientComment(e.target.value)}
                                        placeholder="Напишите дополнительные пожелания или вопросы..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-pink-500 focus:border-pink-500 transition-all"
                                        rows={3}
                                    />
                                </div>
                            )}

                            {/* Отображение ошибки */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Итоговая строка и кнопка подтверждения */}
                            <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                {canBook && selectedServiceData && (
                                    <div className="text-sm text-gray-600">
                                        Выбрано: <span className="font-semibold text-gray-900">{selectedServiceData.title || selectedServiceData.name}</span> в{' '}
                                        <span className="font-semibold text-gray-900">{selectedTime}</span> ({formatDateString(selectedDate)})
                                        {selectedServiceData.price && (
                                            <span className="ml-2 text-pink-600 font-semibold">{selectedServiceData.price} ₽</span>
                                        )}
                                    </div>
                                )}
                                <button
                                    disabled={!canBook || submitting}
                                    onClick={handleSubmitBooking}
                                    className={`w-full sm:w-auto ml-auto px-6 py-3 rounded-xl text-white font-medium shadow-md transition-all flex items-center justify-center gap-2 ${
                                        canBook && !submitting
                                            ? 'bg-pink-500 hover:bg-pink-600 active:scale-[0.98]'
                                            : 'bg-gray-300 cursor-not-allowed shadow-none'
                                    }`}
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Отправка...
                                        </>
                                    ) : (
                                        'Подтвердить запись'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}