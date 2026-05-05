import { useState } from 'react';
import { Calendar, Briefcase, Image as ImageIcon, Settings, BarChart3, Star, LogOut } from 'lucide-react';
import { ServiceManager } from './ServiceManager';
import { PortfolioManager } from './PortfolioManager';
import { BookingsManager } from './BookingManager';
import { ReviewsManager } from './ReviewsManager';

interface MasterDashboardProps {
    onLogout?: () => void;
}

export function MasterDashboard({ onLogout }: MasterDashboardProps) {
    const [activeSection, setActiveSection] = useState<'overview' | 'services' | 'portfolio' | 'bookings' | 'reviews'>('overview');

    const stats = [
        { label: 'Записей сегодня', value: '8', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
        { label: 'Услуг', value: '12', icon: Briefcase, color: 'bg-green-100 text-green-600' },
        { label: 'Работ в портфолио', value: '24', icon: ImageIcon, color: 'bg-purple-100 text-purple-600' },
        { label: 'Доход за месяц', value: '₽156 000', icon: BarChart3, color: 'bg-pink-100 text-pink-600' }
    ];

    const upcomingBookings = [
        { time: '10:00', client: 'Мария Иванова', service: 'Стрижка', duration: '60 мин' },
        { time: '12:00', client: 'Анна Смирнова', service: 'Окрашивание', duration: '120 мин' },
        { time: '15:00', client: 'Елена Петрова', service: 'Укладка', duration: '45 мин' }
    ];

    const menuItems = [
        { id: 'overview', label: 'Обзор', icon: BarChart3 },
        { id: 'bookings', label: 'Записи', icon: Calendar },
        { id: 'services', label: 'Услуги и график', icon: Briefcase },
        { id: 'portfolio', label: 'Портфолио', icon: ImageIcon },
        { id: 'reviews', label: 'Отзывы', icon: Star }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1>Личный кабинет мастера</h1>
                            <p className="text-gray-600">Анна Петрова</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Settings size={24} />
                            </button>
                            {onLogout && (
                                <button
                                    onClick={onLogout}
                                    className="px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors"
                                >
                                    <LogOut size={20} />
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
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id as any)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        activeSection === item.id
                                            ? 'bg-pink-50 text-pink-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <main className="flex-1">
                        {activeSection === 'overview' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {stats.map((stat, index) => (
                                        <div key={index} className="bg-white rounded-xl p-6">
                                            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                                                <stat.icon size={24} />
                                            </div>
                                            <p className="text-2xl mb-1">{stat.value}</p>
                                            <p className="text-sm text-gray-600">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-white rounded-xl p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2>Записи на сегодня</h2>
                                        <button className="text-pink-600 hover:text-pink-700 text-sm">
                                            Посмотреть все
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {upcomingBookings.map((booking, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-pink-300 transition-colors"
                                            >
                                                <div className="w-16 text-center">
                                                    <p className="text-lg">{booking.time}</p>
                                                    <p className="text-xs text-gray-500">{booking.duration}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">{booking.client}</p>
                                                    <p className="text-sm text-gray-600">{booking.service}</p>
                                                </div>
                                                <button className="px-4 py-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                                                    Детали
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'services' && <ServiceManager />}
                        {activeSection === 'portfolio' && <PortfolioManager />}
                        {activeSection === 'bookings' && <BookingsManager />}
                        {activeSection === 'reviews' && <ReviewsManager />}
                    </main>
                </div>
            </div>
        </div>
    );
}
