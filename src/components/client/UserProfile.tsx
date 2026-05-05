import { useState } from 'react';
import { User, Calendar, Settings, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserProfileProps {
    user: { name: string; email: string };
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

export function UserProfile({ user, onClose, onUpdateUser }: UserProfileProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);
    const [cancelReason, setCancelReason] = useState('');

    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phone: '+7 (900) 123-45-67',
        city: 'Москва',
        birthDate: '1990-05-15'
    });

    const [bookings, setBookings] = useState<Booking[]>([
        {
            id: '1',
            masterName: 'Анна Петрова',
            masterImage: 'https://images.unsplash.com/photo-1761839256791-6a93f89fb8b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            service: 'Стрижка женская',
            date: '2026-05-08',
            time: '14:00',
            price: 2500,
            status: 'upcoming'
        },
        {
            id: '2',
            masterName: 'Мария Соколова',
            masterImage: 'https://images.unsplash.com/photo-1753285311550-154917dab783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            service: 'Маникюр с покрытием',
            date: '2026-05-10',
            time: '11:00',
            price: 2000,
            status: 'upcoming'
        },
        {
            id: '3',
            masterName: 'Елена Волкова',
            masterImage: 'https://images.unsplash.com/photo-1653130029149-9109b115ab9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            service: 'Вечерний макияж',
            date: '2026-04-28',
            time: '16:00',
            price: 4500,
            status: 'completed'
        }
    ]);

    const handleSaveProfile = () => {
        onUpdateUser({
            name: formData.name,
            email: formData.email
        });
    };

    const handleCancelBooking = () => {
        if (!cancellingBooking || !cancelReason.trim()) return;

        setBookings(bookings.map(b =>
            b.id === cancellingBooking ? { ...b, status: 'cancelled' as const } : b
        ));

        setShowCancelModal(false);
        setCancellingBooking(null);
        setCancelReason('');
    };

    const openCancelModal = (bookingId: string) => {
        setCancellingBooking(bookingId);
        setShowCancelModal(true);
    };

    const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
    const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

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
                        <h2 className="text-2xl mb-1">Мой профиль</h2>
                        <p className="text-white/80">{user.name}</p>
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
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm mb-2">Email</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            />
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
                                        <div>
                                            <label className="block text-sm mb-2">Дата рождения</label>
                                            <input
                                                type="date"
                                                value={formData.birthDate}
                                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
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
                                            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                                        >
                                            Сохранить
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
                                                                    className="text-sm text-red-600 hover:text-red-700"
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
                                            {pastBookings.map((booking) => (
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
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            {showCancelModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
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
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-24"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setCancellingBooking(null);
                                    setCancelReason('');
                                }}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Назад
                            </button>
                            <button
                                onClick={handleCancelBooking}
                                disabled={!cancelReason.trim()}
                                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Отменить запись
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}
