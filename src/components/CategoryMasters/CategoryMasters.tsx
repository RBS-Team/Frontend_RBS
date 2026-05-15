import { useEffect, useState, useMemo } from 'react';
import {
    X,
    SlidersHorizontal,
    ChevronLeft,
    ChevronRight,
    Map as MapIcon,
    List
} from 'lucide-react';
import { MasterCard } from '../MasterCard/MasterCard';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../api/apiFetch';
import { MapComponent } from '../VK_Maps/map';
import { BookingModal } from '../BookingModal/BookingModal';
import { AuthModal } from '../AuthModal/AuthModal'; // Добавьте импорт

interface masters {
    id: string;
    first_name: string;
    last_name: string;
    category_id: string;
    imageUrl: string;
    rating: number;
    reviews: number;
    location: string;
    price: number;
    isVerified: boolean;
    portfolio: string[];
    lat: number;
    lon: number;
    bio: string;
}

interface CategoryMastersProps {
    categoryTitle: string;
    onClose: () => void;
    onBack?: () => void;
    onBookClick: (masters: any) => void;
}

export function CategoryMasters({ categoryTitle }: CategoryMastersProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');
    const [minRating, setMinRating] = useState(0);
    const [selectedCity, setSelectedCity] = useState('all');
    const [sortBy, setSortBy] = useState<'rating' | 'price' | 'reviews'>('rating');

    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedMaster, setSelectedMaster] = useState<any>(null);
    const [showAuthModal, setShowAuthModal] = useState(false); // Добавьте состояние для модалки авторизации

    // Храним весь массив мастеров (33 записи), полученный от сервера
    const [allMasters, setAllMasters] = useState<masters[]>([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null); // Добавьте состояние для пользователя

    const navigate = useNavigate();
    const { id } = useParams();

    // Функция для проверки авторизации пользователя
    const checkUserAuth = () => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                setCurrentUser(parsedUser);
                return parsedUser;
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
                return null;
            }
        }
        return null;
    };

    // Обновленная функция handleBookClick
    const handleBookClick = (master: any) => {
        // Проверяем наличие пользователя в localStorage
        const user = checkUserAuth();

        if (!user) {
            // Если пользователь не авторизован, показываем модалку авторизации
            setSelectedMaster(master);
            setShowAuthModal(true);
        } else {
            // Если пользователь авторизован, показываем модалку бронирования
            setSelectedMaster(master);
            setShowBookingModal(true);
        }
    };

    // Функция для обработки успешной авторизации
    const handleAuthSuccess = (user: { id: string; role: string; name: string }) => {
        // Сохраняем пользователя в localStorage (если еще не сохранен)
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);

        // Закрываем модалку авторизации
        setShowAuthModal(false);

        // Открываем модалку бронирования для выбранного мастера
        if (selectedMaster) {
            setShowBookingModal(true);
        }
    };

    const onClose = () => navigate('/');
    const onBack = () => navigate(-1);

    useEffect(() => {
        // Проверяем авторизацию при загрузке компонента
        checkUserAuth();
    }, []);

    useEffect(() => {
        setLoading(true);
        apiFetch(`/categories/${id}/masters?limit=100`)
            .then((res) => {
                if (res.ok) {
                    const items = res.data.items || res.data;
                    setAllMasters(items);
                } else {
                    console.error(res);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    // Сбрасываем страницу на первую при любом изменении фильтрации
    useEffect(() => {
        setPage(1);
    }, [priceRange, minRating, selectedCity, sortBy]);

    // 1. Фильтрация и сортировка полного списка на клиенте
    const filteredAndSortedMasters = useMemo(() => {
        let result = [...allMasters];

        if (minRating > 0) {
            result = result.filter((m) => m.rating >= minRating);
        }

        if (selectedCity !== 'all') {
            result = result.filter((m) => m.location.includes(selectedCity));
        }

        if (priceRange !== 'all') {
            result = result.filter((m) => {
                if (priceRange === 'low') return m.price < 2500;
                if (priceRange === 'medium') return m.price >= 2500 && m.price < 4000;
                if (priceRange === 'high') return m.price >= 4000;
                return true;
            });
        }

        result.sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'price') return a.price - b.price;
            if (sortBy === 'reviews') return b.reviews - a.reviews;
            return 0;
        });

        return result;
    }, [allMasters, priceRange, minRating, selectedCity, sortBy]);

    // 2. Нарезка отфильтрованного списка на страницы по 10 элементов
    const displayedMasters = useMemo(() => {
        const startIndex = (page - 1) * limit;
        return filteredAndSortedMasters.slice(startIndex, startIndex + limit);
    }, [filteredAndSortedMasters, page, limit]);

    const totalPages = Math.ceil(filteredAndSortedMasters.length / limit);

    return (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            {/* HEADER */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onBack || onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Назад"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <div>
                                <h1 className="mb-1 text-xl font-bold">{categoryTitle}</h1>
                                <p className="text-gray-600 text-sm">
                                    Найдено мастеров: {loading ? '...' : filteredAndSortedMasters.length}
                                </p>
                            </div>
                        </div>

                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* CONTROLS */}
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium ${
                                    showFilters ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <SlidersHorizontal size={18} />
                                Фильтры
                            </button>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="rating">По рейтингу</option>
                                <option value="price">По цене</option>
                                <option value="reviews">По отзывам</option>
                            </select>
                        </div>

                        {/* VIEW SWITCH */}
                        <div className="flex gap-2 bg-gray-100 rounded-lg p-1 text-sm font-medium">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                    viewMode === 'list' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <List size={18} />
                                Список
                            </button>

                            <button
                                onClick={() => setViewMode('map')}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                    viewMode === 'map' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <MapIcon size={18} />
                                Карта
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT (pb-24 добавлен для исключения перекрытия карточек нижней панелью) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
                {viewMode === 'list' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedMasters.map((master) => (
                            <MasterCard
                                key={master.id}
                                master={master}
                                onBookClick={handleBookClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="h-[600px] rounded-xl overflow-hidden border border-gray-200">
                        {/* На карту выводим всех отфильтрованных мастеров без постраничной нарезки */}
                        <MapComponent masters={filteredAndSortedMasters} />
                    </div>
                )}
            </div>

            {/* FIXED PAGINATION CONTROLS */}
            {totalPages > 1 && viewMode === 'list' && (
                <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 py-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center gap-4">
                        <button
                            disabled={page === 1}
                            onClick={() => {
                                setPage((p) => p - 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                        >
                            <ChevronLeft />
                        </button>

                        <span className="text-sm font-semibold text-gray-700 min-w-[100px] text-center">
                            Страница {page} из {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => {
                                setPage((p) => p + 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            )}

            {/* MODALS */}
            {showAuthModal && selectedMaster && (
                <AuthModal
                    onClose={() => {
                        setShowAuthModal(false);
                        setSelectedMaster(null);
                    }}
                    onSuccess={handleAuthSuccess}
                />
            )}

            {showBookingModal && selectedMaster && currentUser && (
                <BookingModal
                    master={selectedMaster}
                    onClose={() => {
                        setShowBookingModal(false);
                        setSelectedMaster(null);
                    }}
                />
            )}
        </div>
    );
}