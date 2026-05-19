import { useState, useEffect } from 'react';
import {
    Calendar,
    Briefcase,
    Image as ImageIcon,
    BarChart3,
    Star,
    LogOut,
    X,
    CalendarPlus2,
    Loader2
} from 'lucide-react';

import { ServiceManager } from './ServiceManager';
import { PortfolioManager } from './PortfolioManager';
import { BookingsManager } from './BookingManager';
import { ReviewsManager } from './ReviewsManager';

import { useNavigate } from 'react-router-dom';
import { ScheduleManager } from './ScheduleManager';

import { apiFetch } from '../../api/apiFetch';
import {ToastContainer} from "../Toasts/Toasts";
import {useToast} from "../../hooks/useToasts";

interface MasterDashboardProps {
    onLogout?: () => void;
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

interface TodayBooking {
    id: string;
    time: string;
    duration: string;
    client: string;
    service: string;
    status: string;
}

export function MasterDashboard({
                                    onLogout,
                                }: MasterDashboardProps) {
    const [activeSection, setActiveSection] =
        useState<
            | 'overview'
            | 'services'
            | 'portfolio'
            | 'bookings'
            | 'reviews'
            | 'schedule'
        >('overview');

    const [todayBookings, setTodayBookings] =
        useState<TodayBooking[]>([]);


    const [loadingToday, setLoadingToday] =
        useState(true);

    const user = JSON.parse(
        localStorage.getItem('user') || '{}'
    );

    console.log(user)

    const navigate = useNavigate();
    const toast = useToast();

    const onClose = () => {
        navigate('/');
    };

    useEffect(() => {
        fetchTodayBookings();
    }, []);

    const fetchTodayBookings = async () => {
        setLoadingToday(true);

        try {
            const today = new Date()
                .toISOString()
                .split('T')[0];

            const response = await apiFetch(
                `/master-appointments?start_date=${today}&end_date=${today}&status=all`
            );

            console.log(
                'Today bookings response:',
                response
            );

            const data: ApiBooking[] =
                Array.isArray(response)
                    ? response
                    : response.data ||
                    response.items ||
                    response.results ||
                    [];

            const transformedBookings: TodayBooking[] =
                data
                    .filter(
                        (booking) =>
                            !booking.is_manual_block
                    )
                    .sort(
                        (a, b) =>
                            new Date(
                                a.start_at
                            ).getTime() -
                            new Date(
                                b.start_at
                            ).getTime()
                    )
                    .map((booking) => {
                        const startDate =
                            new Date(
                                booking.start_at
                            );

                        return {
                            id: booking.id,

                            time:
                                startDate.toLocaleTimeString(
                                    'ru-RU',
                                    {
                                        hour: '2-digit',
                                        minute:
                                            '2-digit',
                                    }
                                ),

                            duration: `${booking.duration_minutes} мин`,

                            client:
                                booking.client_name ||
                                `Клиент ${booking.client_id?.slice(
                                    0,
                                    6
                                )}`,

                            service:
                            booking.service_title,

                            status:
                            booking.status,
                        };
                    });

            setTodayBookings(
                transformedBookings
            );

        } catch (error) {
            console.error(
                'Error fetching today bookings:',
                error
            );

            setTodayBookings([]);

        } finally {
            setLoadingToday(false);
        }
    };

    const stats = [
        {
            label: 'Записей сегодня',
            value: todayBookings.length,
            icon: Calendar,
            color:
                'bg-blue-100 text-blue-600',
        },

        {
            label: 'Услуг',
            value: '12',
            icon: Briefcase,
            color:
                'bg-green-100 text-green-600',
        },

        {
            label: 'Работ в портфолио',
            value: '24',
            icon: ImageIcon,
            color:
                'bg-purple-100 text-purple-600',
        },

        {
            label: 'Доход за месяц',
            value: '₽156 000',
            icon: BarChart3,
            color:
                'bg-pink-100 text-pink-600',
        },
    ];

    const menuItems = [
        {
            id: 'overview',
            label: 'Обзор',
            icon: BarChart3,
        },

        {
            id: 'bookings',
            label: 'Записи',
            icon: Calendar,
        },

        {
            id: 'services',
            label: 'Услуги',
            icon: Briefcase,
        },

        {
            id: 'schedule',
            label: 'График',
            icon: CalendarPlus2,
        },

        {
            id: 'portfolio',
            label: 'Портфолио',
            icon: ImageIcon,
        },

        {
            id: 'reviews',
            label: 'Отзывы',
            icon: Star,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1>
                                Личный кабинет
                                мастера
                            </h1>

                            <p className="text-gray-600">
                                {user?.name ||
                                    'Мастер'}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {onLogout && (
                                <button
                                    onClick={
                                        onLogout
                                    }
                                    className="px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors"
                                >
                                    <LogOut
                                        size={
                                            20
                                        }
                                    />
                                    Выйти
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-6">
                    <aside className="w-64 bg-white rounded-xl p-4 h-fit sticky top-8">
                        <nav className="space-y-2">
                            {menuItems.map(
                                (item) => (
                                    <button
                                        key={
                                            item.id
                                        }
                                        onClick={() =>
                                            setActiveSection(
                                                item.id as any
                                            )
                                        }
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            activeSection ===
                                            item.id
                                                ? 'bg-pink-50 text-pink-600'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <item.icon
                                            size={
                                                20
                                            }
                                        />

                                        {
                                            item.label
                                        }
                                    </button>
                                )
                            )}
                        </nav>
                    </aside>

                    <main className="flex-1">
                        {activeSection ===
                            'overview' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {stats.map(
                                            (
                                                stat,
                                                index
                                            ) => (
                                                <div
                                                    key={
                                                        index
                                                    }
                                                    className="bg-white rounded-xl p-6"
                                                >
                                                    <div
                                                        className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}
                                                    >
                                                        <stat.icon
                                                            size={
                                                                24
                                                            }
                                                        />
                                                    </div>

                                                    <p className="text-2xl mb-1">
                                                        {
                                                            stat.value
                                                        }
                                                    </p>

                                                    <p className="text-sm text-gray-600">
                                                        {
                                                            stat.label
                                                        }
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <div className="bg-white rounded-xl p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2>
                                                Записи
                                                на
                                                сегодня
                                            </h2>

                                        </div>

                                        {loadingToday ? (
                                            <div className="flex justify-center py-10">
                                                <Loader2
                                                    className="animate-spin text-pink-500"
                                                    size={
                                                        32
                                                    }
                                                />
                                            </div>
                                        ) : todayBookings.length ===
                                        0 ? (
                                            <div className="text-center py-10 text-gray-500">
                                                На
                                                сегодня
                                                записей
                                                нет
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {todayBookings.map(
                                                    (
                                                        booking
                                                    ) => (
                                                        <div
                                                            key={
                                                                booking.id
                                                            }
                                                            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-pink-300 transition-colors"
                                                        >
                                                            <div className="w-16 text-center">
                                                                <p className="text-lg">
                                                                    {
                                                                        booking.time
                                                                    }
                                                                </p>

                                                                <p className="text-xs text-gray-500">
                                                                    {
                                                                        booking.duration
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div className="flex-1">
                                                                <p className="font-medium">
                                                                    {
                                                                        booking.client
                                                                    }
                                                                </p>

                                                                <p className="text-sm text-gray-600">
                                                                    {
                                                                        booking.service
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div
                                                                className={`px-3 py-1 rounded-full text-xs ${
                                                                    booking.status ===
                                                                    'confirmed'
                                                                        ? 'bg-blue-100 text-blue-700'
                                                                        : booking.status ===
                                                                        'completed'
                                                                            ? 'bg-green-100 text-green-700'
                                                                            : booking.status ===
                                                                            'cancelled'
                                                                                ? 'bg-red-100 text-red-700'
                                                                                : 'bg-yellow-100 text-yellow-700'
                                                                }`}
                                                            >
                                                                {
                                                                    booking.status
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        {activeSection ===
                            'services' && (
                                <ServiceManager
                                    masterID={
                                        user.id
                                    }
                                    onShowToast={(message, type) => {
                                    if (type === 'success') toast.success(message);
                                    else toast.error(message);
                                }}/>

                            )}

                        {activeSection ===
                            'schedule' && (
                                <ScheduleManager
                                    masterId={
                                        user.id
                                    }
                                    onShowToast={(message, type) => {
                                        if (type === 'success') toast.success(message);
                                        else toast.error(message);
                                    }}
                                />
                            )}

                        {activeSection ===
                            'portfolio' && (
                                <PortfolioManager
                                    masterID={
                                        user.id
                                    }
                                    onShowToast={(message, type) => {
                                        if (type === 'success') toast.success(message);
                                        else toast.error(message);
                                    }}
                                />
                            )}

                        {activeSection ===
                            'bookings' && (
                                <BookingsManager onShowToast={(message, type) => {
                                    if (type === 'success') toast.success(message);
                                    else toast.error(message);
                                }}/>
                            )}

                        {activeSection ===
                            'reviews' && (
                                <ReviewsManager />
                            )}
                        <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
                    </main>
                </div>
            </div>
        </div>
    );
}