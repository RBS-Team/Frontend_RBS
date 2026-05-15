import { useState, useEffect } from 'react';
import { User, Calendar, Settings, X, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiFetch } from "../../api/apiFetch";

interface UserProfileProps {
    user: { id: string; name: string; email: string; role: string };
    onClose: () => void;
    onUpdateUser: (user: { name: string; email: string }) => void;
}

interface Booking {
    id: string;
    masterName: string;
    masterImage: string;
    service: string;
    date: string;
    time: string;
    price: number;
    status: 'upcoming' | 'completed' | 'cancelled';
}

interface ClientData {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    phone: string;
    avatar_url: string;
}

interface ApiAppointment {
    id: string;
    client_comment: string;
    duration_minutes: number;
    end_at: string;
    master_avatar: string;
    master_id: string;
    master_lat: number;
    master_lon: number;
    master_name: string;
    master_note: string;
    price: number;
    service_id: string;
    service_title: string;
    start_at: string;
    status: string;
}

export function UserProfile({ onClose, onUpdateUser }: UserProfileProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [saving, setSaving] = useState(false);
    const [clientData, setClientData] = useState<ClientData | null>(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: user.email,
        phone: '',
        city: 'Москва',
        birthDate: ''
    });

    const [bookings, setBookings] = useState<Booking[]>([]);

    // Загрузка данных клиента
    useEffect(() => {
        fetchClientData();
        fetchBookings();
    }, [user.id]);

    const fetchClientData = async () => {
        try {
            setLoading(true);
            const response = await apiFetch(`/clients/user/${user.id}`);
            const data = await response.data;

            setClientData(data);
            setFormData({
                firstName: data.first_name || '',
                lastName: data.last_name || '',
                email: user.email,
                phone: data.phone || '',
                city: 'Москва',
                birthDate: ''
            });
        } catch (error) {
            console.error('Ошибка загрузки данных клиента:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        try {
            setLoadingBookings(true);
            const response = await apiFetch('/appointments/my');
            const appointments: ApiAppointment[] = await response.data;

            // Преобразуем API ответ в формат Booking
            const formattedBookings = appointments.map((appointment) => {
                // Определяем статус на основе API статуса и даты
                let status: 'upcoming' | 'completed' | 'cancelled' = 'upcoming';
                const appointmentDateTime = new Date(appointment.start_at);
                const now = new Date();

                if (appointment.status === 'cancelled') {
                    status = 'cancelled';
                } else if (appointmentDateTime < now) {
                    status = 'completed';
                } else {
                    status = 'upcoming';
                }

                // Форматируем дату и время
                const startDate = new Date(appointment.start_at);
                const date = startDate.toISOString().split('T')[0];
                const time = startDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

                return {
                    id: appointment.id,
                    masterName: appointment.master_name,
                    masterImage: appointment.master_avatar || 'https://via.placeholder.com/100x100?text=Master',
                    service: appointment.service_title,
                    date: date,
                    time: time,
                    price: appointment.price,
                    status: status
                };
            });

            // Сортируем: сначала предстоящие, потом завершенные/отмененные
            const sortedBookings = formattedBookings.sort((a, b) => {
                if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
                if (a.status !== 'upcoming' && b.status === 'upcoming') return 1;
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });

            setBookings(sortedBookings);
        } catch (error) {
            console.error('Ошибка загрузки записей:', error);
            alert('Не удалось загрузить записи. Пожалуйста, попробуйте позже.');
        } finally {
            setLoadingBookings(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);

            const payload = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone: formData.phone,
                user_id: user.id
            };

            const response = await apiFetch(`/clients/user/${user.id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Ошибка при сохранении');
            }

            // Обновляем локальные данные
            const updatedName = `${formData.firstName} ${formData.lastName}`.trim();
            onUpdateUser({
                name: updatedName,
                email: formData.email
            });

            alert('Профиль успешно обновлен!');
        } catch (error) {
            console.error('Ошибка сохранения профиля:', error);
            alert('Ошибка при сохранении профиля');
        } finally {
            setSaving(false);
        }
    };

    const handleCancelBooking = async () => {
        if (!cancellingBooking || !cancelReason.trim()) return;

        try {
            setCancelling(true);

            // Отправляем PATCH запрос на отмену записи
            const response = await apiFetch(`/appointments/${cancellingBooking}/cancel`, {
                method: 'PATCH',
                body: JSON.stringify({ reason: cancelReason })
            });

            if (!response.ok) {
                const errorData = await response.data;
                throw new Error(errorData?.message || 'Ошибка при отмене записи');
            }

            // Обновляем локальное состояние - меняем статус на cancelled
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.id === cancellingBooking
                        ? { ...booking, status: 'cancelled' as const }
                        : booking
                )
            );

            // Закрываем модальное окно и сбрасываем состояние
            setShowCancelModal(false);
            setCancellingBooking(null);
            setCancelReason('');

            // Показываем сообщение об успехе
            alert('Запись успешно отменена');
        } catch (error) {
            console.error('Ошибка отмены записи:', error);
            alert(error instanceof Error ? error.message : 'Ошибка при отмене записи');
        } finally {
            setCancelling(false);
        }
    };

    const openCancelModal = (bookingId: string) => {
        setCancellingBooking(bookingId);
        setShowCancelModal(true);
    };

    const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
    const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 flex flex-col items-center">
                    <Loader2 className="animate-spin text-pink-500" size={48} />
                    <p className="mt-4 text-gray-600">Загрузка профиля...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                >
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-4">
                            {clientData?.avatar_url && (
                                <img
                                    src={clientData.avatar_url}
                                    alt="Avatar"
                                    className="w-16 h-16 rounded-full object-cover border-2 border-white"
                                />
                            )}
                            <div>
                                <h2 className="text-2xl mb-1">Мой профиль</h2>
                                <p className="text-white/80">
                                    {formData.firstName} {formData.lastName}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-200">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors relative ${
                                    activeTab === 'profile'
                                        ? 'text-pink-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <User size={20} />
                                Личные данные
                                {activeTab === 'profile' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"
                                    />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('bookings')}
                                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors relative ${
                                    activeTab === 'bookings'
                                        ? 'text-pink-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <Calendar size={20} />
                                Мои записи
                                {activeTab === 'bookings' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"
                                    />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm mb-2">Имя</label>
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm mb-2">Фамилия</label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm mb-2">Email</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50"
                                                disabled
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Email нельзя изменить</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm mb-2">Телефон</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm mb-2">Город</label>
                                            <input
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={onClose}
                                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Отмена
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {saving && <Loader2 size={18} className="animate-spin" />}
                                            {saving ? 'Сохранение...' : 'Сохранить'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'bookings' && (
                                <motion.div
                                    key="bookings"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    {loadingBookings ? (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <Loader2 className="animate-spin text-pink-500" size={48} />
                                            <p className="mt-4 text-gray-600">Загрузка записей...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <h3 className="mb-4">Предстоящие записи ({upcomingBookings.length})</h3>
                                                <div className="space-y-3">
                                                    {upcomingBookings.length === 0 ? (
                                                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                                                            <Calendar className="mx-auto mb-3 text-gray-400" size={40} />
                                                            <p className="text-gray-600">У вас нет предстоящих записей</p>
                                                        </div>
                                                    ) : (
                                                        upcomingBookings.map((booking) => (
                                                            <div
                                                                key={booking.id}
                                                                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                                                            >
                                                                <div className="flex gap-4">
                                                                    <img
                                                                        src={booking.masterImage}
                                                                        alt={booking.masterName}
                                                                        className="w-20 h-20 rounded-xl object-cover"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <div>
                                                                                <h4 className="mb-1">{booking.service}</h4>
                                                                                <p className="text-sm text-gray-600">Мастер: {booking.masterName}</p>
                                                                            </div>
                                                                            <p className="text-pink-600">{booking.price} ₽</p>
                                                                        </div>
                                                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                                            <span>📅 {new Date(booking.date).toLocaleDateString('ru-RU', {
                                                                                day: 'numeric',
                                                                                month: 'long'
                                                                            })}</span>
                                                                            <span>🕐 {booking.time}</span>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => openCancelModal(booking.id)}
                                                                            className="text-sm text-red-600 hover:text-red-700 transition-colors"
                                                                        >
                                                                            Отменить запись
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="mb-4">История записей ({pastBookings.length})</h3>
                                                <div className="space-y-3">
                                                    {pastBookings.length === 0 ? (
                                                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                                                            <Calendar className="mx-auto mb-3 text-gray-400" size={40} />
                                                            <p className="text-gray-600">У вас нет записей в истории</p>
                                                        </div>
                                                    ) : (
                                                        pastBookings.map((booking) => (
                                                            <div
                                                                key={booking.id}
                                                                className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                                                            >
                                                                <div className="flex gap-4">
                                                                    <img
                                                                        src={booking.masterImage}
                                                                        alt={booking.masterName}
                                                                        className="w-20 h-20 rounded-xl object-cover opacity-75"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <div>
                                                                                <h4 className="mb-1">{booking.service}</h4>
                                                                                <p className="text-sm text-gray-600">Мастер: {booking.masterName}</p>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <p className="text-gray-600">{booking.price} ₽</p>
                                                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                                                    booking.status === 'completed'
                                                                                        ? 'bg-green-100 text-green-700'
                                                                                        : 'bg-red-100 text-red-700'
                                                                                }`}>
                                                                                    {booking.status === 'completed' ? 'Выполнена' : 'Отменена'}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                                            <span>📅 {new Date(booking.date).toLocaleDateString('ru-RU', {
                                                                                day: 'numeric',
                                                                                month: 'long'
                                                                            })}</span>
                                                                            <span>🕐 {booking.time}</span>
                                                                        </div>
                                                                        {booking.status === 'cancelled' && booking.cancelReason && (
                                                                            <p className="text-sm text-gray-500 mt-2">
                                                                                Причина отмены: {booking.cancelReason}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            {/* Модальное окно отмены записи */}
            <AnimatePresence>
                {showCancelModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-md w-full p-6"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="text-red-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="mb-2">Отменить запись?</h3>
                                    <p className="text-sm text-gray-600">
                                        Пожалуйста, укажите причину отмены. Это поможет мастеру улучшить свой сервис.
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm mb-2">Причина отмены</label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="Например: изменились планы, нашел другого мастера..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-24 resize-none"
                                    disabled={cancelling}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowCancelModal(false);
                                        setCancellingBooking(null);
                                        setCancelReason('');
                                    }}
                                    disabled={cancelling}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Назад
                                </button>
                                <button
                                    onClick={handleCancelBooking}
                                    disabled={!cancelReason.trim() || cancelling}
                                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {cancelling && <Loader2 size={18} className="animate-spin" />}
                                    {cancelling ? 'Отмена...' : 'Отменить запись'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}