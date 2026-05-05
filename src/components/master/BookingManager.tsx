import { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, Check, X, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface Booking {
    id: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    service: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    price: number;
    notes?: string;
}

export function BookingsManager() {
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
    const [bookings, setBookings] = useState<Booking[]>([
        {
            id: '1',
            clientName: 'Анна Петрова',
            clientPhone: '+7 (900) 123-45-67',
            clientEmail: 'anna@example.com',
            service: 'Стрижка женская',
            date: '2026-05-08',
            time: '14:00',
            status: 'pending',
            price: 2500,
            notes: 'Хочу каскад'
        },
        {
            id: '2',
            clientName: 'Мария Сидорова',
            clientPhone: '+7 (900) 234-56-78',
            clientEmail: 'maria@example.com',
            service: 'Окрашивание',
            date: '2026-05-09',
            time: '10:00',
            status: 'confirmed',
            price: 4500
        },
        {
            id: '3',
            clientName: 'Елена Иванова',
            clientPhone: '+7 (900) 345-67-89',
            clientEmail: 'elena@example.com',
            service: 'Стрижка + укладка',
            date: '2026-05-06',
            time: '16:00',
            status: 'completed',
            price: 3200
        },
        {
            id: '4',
            clientName: 'Ольга Смирнова',
            clientPhone: '+7 (900) 456-78-90',
            clientEmail: 'olga@example.com',
            service: 'Маникюр',
            date: '2026-05-10',
            time: '11:30',
            status: 'pending',
            price: 1800
        }
    ]);

    const handleConfirm = (id: string) => {
        setBookings(bookings.map(b =>
            b.id === id ? { ...b, status: 'confirmed' as const } : b
        ));
    };

    const handleCancel = (id: string) => {
        setBookings(bookings.map(b =>
            b.id === id ? { ...b, status: 'cancelled' as const } : b
        ));
    };

    const handleComplete = (id: string) => {
        setBookings(bookings.map(b =>
            b.id === id ? { ...b, status: 'completed' as const } : b
        ));
    };

    const filteredBookings = bookings.filter(b =>
        filter === 'all' ? b.status !== 'cancelled' : b.status === filter
    );

    const getStatusColor = (status: Booking['status']) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'confirmed': return 'bg-blue-100 text-blue-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
        }
    };

    const getStatusText = (status: Booking['status']) => {
        switch (status) {
            case 'pending': return 'Ожидает';
            case 'confirmed': return 'Подтверждена';
            case 'completed': return 'Выполнена';
            case 'cancelled': return 'Отменена';
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="mb-2">Управление записями</h2>
                <p className="text-gray-600">Просматривайте и управляйте записями клиентов</p>
            </div>

            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                {[
                    { key: 'all', label: 'Все', count: bookings.filter(b => b.status !== 'cancelled').length },
                    { key: 'pending', label: 'Ожидают', count: bookings.filter(b => b.status === 'pending').length },
                    { key: 'confirmed', label: 'Подтверждены', count: bookings.filter(b => b.status === 'confirmed').length },
                    { key: 'completed', label: 'Выполнены', count: bookings.filter(b => b.status === 'completed').length }
                ].map(({ key, label, count }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key as any)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                            filter === key
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {label} ({count})
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <Calendar className="mx-auto mb-3 text-gray-400" size={48} />
                        <p className="text-gray-600">Нет записей в этой категории</p>
                    </div>
                ) : (
                    filteredBookings.map((booking) => (
                        <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="mb-1">{booking.service}</h3>
                                            <div className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                                                {getStatusText(booking.status)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-pink-600 text-xl">{booking.price} ₽</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <User size={16} />
                                            <span>{booking.clientName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone size={16} />
                                            <span>{booking.clientPhone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail size={16} />
                                            <span>{booking.clientEmail}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar size={16} />
                                            <span>{new Date(booking.date).toLocaleDateString('ru-RU', {
                                                day: 'numeric',
                                                month: 'long'
                                            })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock size={16} />
                                            <span>{booking.time}</span>
                                        </div>
                                    </div>

                                    {booking.notes && (
                                        <div className="mt-3 flex items-start gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                                            <MessageSquare size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                            <p className="text-gray-700">{booking.notes}</p>
                                        </div>
                                    )}
                                </div>

                                {booking.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleConfirm(booking.id)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                                        >
                                            <Check size={18} />
                                            Подтвердить
                                        </button>
                                        <button
                                            onClick={() => handleCancel(booking.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                                        >
                                            <X size={18} />
                                            Отменить
                                        </button>
                                    </div>
                                )}

                                {booking.status === 'confirmed' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleComplete(booking.id)}
                                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                                        >
                                            <Check size={18} />
                                            Завершить
                                        </button>
                                        <button
                                            onClick={() => handleCancel(booking.id)}
                                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                                        >
                                            <X size={18} />
                                            Отменить
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
