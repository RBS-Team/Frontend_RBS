import { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    Check,
    X,
    MessageSquare,
    Loader2
} from 'lucide-react';

import { motion } from 'motion/react';
import { apiFetch } from '../../api/apiFetch';

interface Booking {
    id: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    service: string;
    date: string;
    time: string;

    status:
        | 'pending'
        | 'confirmed'
        | 'completed'
        | 'cancelled';

    price: number;
    notes?: string;
}

interface ApiBooking {
    client_avatar?: string;
    client_comment?: string;
    client_email: string;
    client_id: string;
    client_name?: string;
    client_phone?: string;
    duration_minutes: number;
    end_at: string;
    id: string;
    is_manual_block: boolean;
    master_note?: string;
    price: number;
    service_id: string;
    service_title: string;
    start_at: string;
    status: string;
}

interface BookingStatusUpdate {
    status:
        | 'pending'
        | 'confirmed'
        | 'completed'
        | 'cancelled'
        | 'rejected';

    master_note?: string;
}

export function BookingsManager() {
    const [filter, setFilter] = useState<
        | 'all'
        | 'pending'
        | 'confirmed'
        | 'completed'
        | 'cancelled'
    >('all');

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const getDateRange = () => {
        const start = new Date();
        start.setDate(start.getDate() - 30);

        const end = new Date();
        end.setDate(end.getDate() + 30);

        return {
            start_date: start.toISOString().split('T')[0],
            end_date: end.toISOString().split('T')[0],
        };
    };

    const fetchBookings = async (
        statusFilter: string = 'all'
    ) => {
        setLoading(true);
        setError(null);

        const { start_date, end_date } = getDateRange();

        try {
            const response = await apiFetch(
                `/master-appointments?start_date=${start_date}&end_date=${end_date}&status=${statusFilter}`
            );

            console.log('API response:', response);

            const data: ApiBooking[] = Array.isArray(response)
                ? response
                : response.data ||
                response.items ||
                response.results ||
                [];

            const transformedBookings: Booking[] = data
                .filter(
                    (booking) => !booking.is_manual_block
                )
                .map((booking) => {
                    const startDate = new Date(
                        booking.start_at
                    );

                    const date = startDate
                        .toISOString()
                        .split('T')[0];

                    const time =
                        startDate.toLocaleTimeString(
                            'ru-RU',
                            {
                                hour: '2-digit',
                                minute: '2-digit',
                            }
                        );

                    let status: Booking['status'] =
                        'pending';

                    switch (booking.status) {
                        case 'confirmed':
                            status = 'confirmed';
                            break;

                        case 'completed':
                            status = 'completed';
                            break;

                        case 'cancelled':
                        case 'rejected':
                            status = 'cancelled';
                            break;

                        case 'pending':
                        default:
                            status = 'pending';
                    }

                    return {
                        id: booking.id,

                        clientName:
                            booking.client_name ||
                            `Клиент ${
                                booking.client_id?.slice(
                                    0,
                                    8
                                ) || 'unknown'
                            }`,

                        clientPhone:
                            booking.client_phone ||
                            'Не указан',

                        clientEmail:
                        booking.client_email,

                        service:
                        booking.service_title,

                        date,

                        time,

                        status,

                        price: booking.price,

                        notes:
                            booking.client_comment ||
                            booking.master_note,
                    };
                });

            setBookings(transformedBookings);

        } catch (err) {
            console.error(
                'Error fetching bookings:',
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : 'Ошибка при загрузке записей'
            );

            setBookings([]);

        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (
        id: string,
        newStatus: BookingStatusUpdate['status'],
        masterNote?: string
    ) => {
        setUpdatingId(id);

        try {
            await apiFetch(
                `/appointments/${id}/status`,
                {
                    method: 'PATCH',

                    headers: {
                        'Content-Type':
                            'application/json',
                    },

                    body: JSON.stringify({
                        status: newStatus,
                        master_note:
                            masterNote || '',
                    }),
                }
            );

            setBookings((prev) =>
                prev.map((booking) =>
                    booking.id === id
                        ? {
                            ...booking,

                            status:
                                newStatus ===
                                'rejected'
                                    ? 'cancelled'
                                    : (newStatus as Booking['status']),

                            notes:
                                masterNote ||
                                booking.notes,
                        }
                        : booking
                )
            );

        } catch (err) {
            console.error(
                'Error updating booking:',
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : 'Ошибка при обновлении статуса'
            );

            await fetchBookings(filter);

        } finally {
            setUpdatingId(null);
        }
    };

    const handleConfirm = (id: string) => {
        updateBookingStatus(id, 'confirmed');
    };

    const handleComplete = (id: string) => {
        updateBookingStatus(id, 'completed');
    };

    const handleCancel = (id: string) => {
        updateBookingStatus(
            id,
            'cancelled',
            'Запись отменена мастером'
        );
    };

    const handleReject = (id: string) => {
        updateBookingStatus(
            id,
            'rejected',
            'Заявка отклонена'
        );
    };

    const handlePending = (id: string) => {
        updateBookingStatus(id, 'pending');
    };

    useEffect(() => {
        const statusParam =
            filter === 'all' ? 'all' : filter;

        fetchBookings(statusParam);
    }, [filter]);

    const filteredBookings = bookings.filter((b) =>
        filter === 'all'
            ? true
            : b.status === filter
    );

    const getStatusColor = (
        status: Booking['status']
    ) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';

            case 'confirmed':
                return 'bg-blue-100 text-blue-700';

            case 'completed':
                return 'bg-green-100 text-green-700';

            case 'cancelled':
                return 'bg-red-100 text-red-700';
        }
    };

    const getStatusText = (
        status: Booking['status']
    ) => {
        switch (status) {
            case 'pending':
                return 'Ожидает';

            case 'confirmed':
                return 'Подтверждена';

            case 'completed':
                return 'Выполнена';

            case 'cancelled':
                return 'Отменена';
        }
    };

    if (loading && bookings.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2
                    className="animate-spin text-pink-500"
                    size={48}
                />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="mb-2">
                    Управление записями
                </h2>

                <p className="text-gray-600">
                    Просматривайте и управляйте
                    записями клиентов
                </p>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <p className="text-sm">{error}</p>

                    <button
                        onClick={() =>
                            fetchBookings(filter)
                        }
                        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                        Попробовать снова
                    </button>
                </div>
            )}

            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                {[
                    {
                        key: 'all',
                        label: 'Все',
                        count: bookings.length,
                    },

                    {
                        key: 'pending',
                        label: 'Ожидают',
                        count: bookings.filter(
                            (b) => b.status === 'pending'
                        ).length,
                    },

                    {
                        key: 'confirmed',
                        label: 'Подтверждены',
                        count: bookings.filter(
                            (b) => b.status === 'confirmed'
                        ).length,
                    },

                    {
                        key: 'completed',
                        label: 'Выполнены',
                        count: bookings.filter(
                            (b) => b.status === 'completed'
                        ).length,
                    },

                    {
                        key: 'cancelled',
                        label: 'Отменены',
                        count: bookings.filter(
                            (b) => b.status === 'cancelled'
                        ).length,
                    },
                ].map(({ key, label, count }) => (
                    <button
                        key={key}
                        onClick={() =>
                            setFilter(key as any)
                        }
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
                        <Calendar
                            className="mx-auto mb-3 text-gray-400"
                            size={48}
                        />

                        <p className="text-gray-600">
                            Нет записей в этой
                            категории
                        </p>
                    </div>
                ) : (
                    filteredBookings.map((booking) => (
                        <motion.div
                            key={booking.id}
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="mb-1">
                                                {booking.service}
                                            </h3>

                                            <div
                                                className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(
                                                    booking.status
                                                )}`}
                                            >
                                                {getStatusText(
                                                    booking.status
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-pink-600 text-xl">
                                                {booking.price} ₽
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <User size={16} />
                                            <span>
                                                {booking.clientName}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone size={16} />
                                            <span>
                                                {booking.clientPhone}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail size={16} />
                                            <span>
                                                {booking.clientEmail}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar size={16} />

                                            <span>
                                                {new Date(
                                                    booking.date
                                                ).toLocaleDateString(
                                                    'ru-RU',
                                                    {
                                                        day: 'numeric',
                                                        month:
                                                            'long',
                                                    }
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock size={16} />

                                            <span>
                                                {booking.time}
                                            </span>
                                        </div>
                                    </div>

                                    {booking.notes && (
                                        <div className="mt-3 flex items-start gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                                            <MessageSquare
                                                size={16}
                                                className="text-gray-400 mt-0.5 flex-shrink-0"
                                            />

                                            <p className="text-gray-700">
                                                {booking.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {updatingId === booking.id ? (
                                    <div className="flex items-center justify-center min-w-[140px]">
                                        <Loader2
                                            className="animate-spin text-pink-500"
                                            size={24}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        {booking.status ===
                                            'pending' && (
                                                <div className="flex gap-2 flex-wrap">
                                                    <button
                                                        onClick={() =>
                                                            handleConfirm(
                                                                booking.id
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                                                    >
                                                        <Check size={18} />
                                                        Подтвердить
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleReject(
                                                                booking.id
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                                                    >
                                                        <X size={18} />
                                                        Отклонить
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleCancel(
                                                                booking.id
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                                                    >
                                                        <X size={18} />
                                                        Отменить
                                                    </button>
                                                </div>
                                            )}

                                        {booking.status ===
                                            'confirmed' && (
                                                <div className="flex gap-2 flex-wrap">
                                                    <button
                                                        onClick={() =>
                                                            handleComplete(
                                                                booking.id
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                                                    >
                                                        <Check size={18} />
                                                        Завершить
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleCancel(
                                                                booking.id
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                                                    >
                                                        <X size={18} />
                                                        Отменить
                                                    </button>
                                                </div>
                                            )}

                                        {booking.status ===
                                            'completed' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handlePending(
                                                                booking.id
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                                                    >
                                                        Вернуть в ожидание
                                                    </button>
                                                </div>
                                            )}

                                        {booking.status ===
                                            'cancelled' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handlePending(
                                                                booking.id
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                                                    >
                                                        Вернуть в ожидание
                                                    </button>
                                                </div>
                                            )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}