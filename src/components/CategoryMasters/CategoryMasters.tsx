import {useEffect, useState} from 'react';
import { X, SlidersHorizontal, MapPin, Star, ChevronLeft, Map as MapIcon, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MasterCard } from '../MasterCard/MasterCard';
import {useNavigate, useParams} from "react-router-dom";
import {apiFetch} from "../../api/apiFetch";

interface Master {
    name: string;
    specialty: string;
    imageUrl: string;
    rating: number;
    reviews: number;
    location: string;
    priceFrom: number;
    isVerified: boolean;
    portfolio: string[];
    lat: number;
    lng: number;
}

interface CategoryMastersProps {
    categoryTitle: string;
    onClose: () => void;
    onBack?: () => void;
    onBookClick: (master: any) => void;
}

export function CategoryMasters({ categoryTitle, onBookClick }: CategoryMastersProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');
    const [minRating, setMinRating] = useState(0);
    const [selectedCity, setSelectedCity] = useState('all');
    const [sortBy, setSortBy] = useState<'rating' | 'price' | 'reviews'>('rating');

    const [services, setService] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const onClose = () =>{
        navigate('/');
    }

    const onBack = () =>{
        navigate(-1);
    }

    useEffect(() => {
        apiFetch(`/categories/${id}/services`)
            .then(res => {
                if (res.ok) {
                    setService(res.data);
                } else {
                    console.error(res);
                }
            })
            .catch(console.error);
    }, []);




    // const allMasters: Master[] = [
    //     {
    //         name: 'Анна Петрова',
    //         specialty: 'Стилист-колорист',
    //         imageUrl: 'https://images.unsplash.com/photo-1761839256791-6a93f89fb8b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         rating: 4.9,
    //         reviews: 156,
    //         location: 'Москва, Центр',
    //         priceFrom: 3500,
    //         isVerified: true,
    //         lat: 55.7558,
    //         lng: 37.6173,
    //         portfolio: [
    //             'https://images.unsplash.com/photo-1638064432601-18b99cb31acb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1605980625458-21e4d9c29c4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1630695239920-4b5bb84a7c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1574773004910-1eeaabb62b55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1605980625969-513c0d1f0c8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1554519880-ffe46861d570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1682450239611-e2c845970926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1658322558683-2524c9b62d04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    //         ]
    //     },
    //     {
    //         name: 'Мария Соколова',
    //         specialty: 'Мастер маникюра',
    //         imageUrl: 'https://images.unsplash.com/photo-1753285311550-154917dab783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         rating: 4.8,
    //         reviews: 203,
    //         location: 'Санкт-Петербург',
    //         priceFrom: 2000,
    //         isVerified: true,
    //         lat: 59.9343,
    //         lng: 30.3351,
    //         portfolio: [
    //             'https://images.unsplash.com/photo-1676926606566-58f2e00b592b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1690749138086-7422f71dc159?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1753285311550-154917dab783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1737326376593-0eb74bff094e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1663229050022-ac26de6f05d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1605980625458-21e4d9c29c4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    //         ]
    //     },
    //     {
    //         name: 'Елена Волкова',
    //         specialty: 'Визажист',
    //         imageUrl: 'https://images.unsplash.com/photo-1653130029149-9109b115ab9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         rating: 5.0,
    //         reviews: 89,
    //         location: 'Москва, Арбат',
    //         priceFrom: 4500,
    //         isVerified: true,
    //         lat: 55.7522,
    //         lng: 37.5989,
    //         portfolio: [
    //             'https://images.unsplash.com/photo-1698181842119-a5283dea1440?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1723150512429-bfa92988d845?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1698181842513-2179d5f8bc65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1585261941042-5da0c5f1f0a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1653130029149-9109b115ab9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1574773004910-1eeaabb62b55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    //         ]
    //     },
    //     {
    //         name: 'Дмитрий Морозов',
    //         specialty: 'Барбер',
    //         imageUrl: 'https://images.unsplash.com/photo-1761931403671-d020a14928d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         rating: 4.9,
    //         reviews: 178,
    //         location: 'Москва, Сокол',
    //         priceFrom: 2500,
    //         isVerified: true,
    //         lat: 55.8058,
    //         lng: 37.5173,
    //         portfolio: [
    //             'https://images.unsplash.com/photo-1761931403671-d020a14928d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1759142016096-a9d1a5ebcc09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1763048208932-cbe149724374?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1675034741473-afed58a142e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1707720531504-ce087725861a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1647462741351-4e7a5e7317c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    //         ]
    //     },
    //     {
    //         name: 'Светлана Иванова',
    //         specialty: 'Мастер бровей',
    //         imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         rating: 4.7,
    //         reviews: 134,
    //         location: 'Москва, Тверская',
    //         priceFrom: 1800,
    //         isVerified: true,
    //         lat: 55.7658,
    //         lng: 37.6073,
    //         portfolio: [
    //             'https://images.unsplash.com/photo-1653130029149-9109b115ab9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1574773004910-1eeaabb62b55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    //         ]
    //     },
    //     {
    //         name: 'Ольга Смирнова',
    //         specialty: 'Косметолог',
    //         imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         rating: 4.9,
    //         reviews: 167,
    //         location: 'Москва, Центр',
    //         priceFrom: 5000,
    //         isVerified: true,
    //         lat: 55.7644,
    //         lng: 37.6386,
    //         portfolio: [
    //             'https://images.unsplash.com/photo-1619367901998-73b3a70b3898?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    //         ]
    //     }
    // ];

    const cities = ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург'];

    let filteredMasters = [...services];
    console.log(filteredMasters);

    if (minRating > 0) {
        filteredMasters = filteredMasters.filter(m => m.rating >= minRating);
    }

    // if (selectedCity !== 'all') {
    //     filteredMasters = filteredMasters.filter(m => m.location.includes(selectedCity));
    // }

    if (priceRange !== 'all') {
        filteredMasters = filteredMasters.filter(m => {
            if (priceRange === 'low') return m.price < 2500;
            if (priceRange === 'medium') return m.price >= 2500 && m.price < 4000;
            if (priceRange === 'high') return m.price >= 4000;
            return true;
        });
    }

    filteredMasters.sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'reviews') return b.reviews - a.reviews;
        return 0;
    });

    return (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onBack || onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Назад к категориям"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <div>
                                <h1 className="mb-1">{categoryTitle}</h1>
                                <p className="text-gray-600">Найдено мастеров: {filteredMasters.length}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center justify-between">
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                    showFilters
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <SlidersHorizontal size={18} />
                                Фильтры
                            </button>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="rating">По рейтингу</option>
                                <option value="price">По цене</option>
                                <option value="reviews">По отзывам</option>
                            </select>
                        </div>

                        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-white text-pink-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <List size={18} />
                                Список
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                    viewMode === 'map'
                                        ? 'bg-white text-pink-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <MapIcon size={18} />
                                Карта
                            </button>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-gray-200 bg-gray-50 overflow-hidden"
                        >
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm mb-2">Город</label>
                                        <select
                                            value={selectedCity}
                                            onChange={(e) => setSelectedCity(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        >
                                            <option value="all">Все города</option>
                                            {cities.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm mb-2">Цена</label>
                                        <select
                                            value={priceRange}
                                            onChange={(e) => setPriceRange(e.target.value as any)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        >
                                            <option value="all">Любая</option>
                                            <option value="low">До 2500 ₽</option>
                                            <option value="medium">2500 - 4000 ₽</option>
                                            <option value="high">От 4000 ₽</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm mb-2">Минимальный рейтинг</label>
                                        <select
                                            value={minRating}
                                            onChange={(e) => setMinRating(Number(e.target.value))}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        >
                                            <option value="0">Любой</option>
                                            <option value="4">4+ ⭐</option>
                                            <option value="4.5">4.5+ ⭐</option>
                                            <option value="4.8">4.8+ ⭐</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => {
                                            setSelectedCity('all');
                                            setPriceRange('all');
                                            setMinRating(0);
                                        }}
                                        className="text-sm text-pink-600 hover:text-pink-700"
                                    >
                                        Сбросить фильтры
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {viewMode === 'list' ? (
                    filteredMasters.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="text-gray-400" size={40} />
                            </div>
                            <h3 className="mb-2">Мастера не найдены</h3>
                            <p className="text-gray-600 mb-4">Попробуйте изменить фильтры или выбрать другой город</p>
                            <button
                                onClick={() => {
                                    setSelectedCity('all');
                                    setPriceRange('all');
                                    setMinRating(0);
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Сбросить фильтры
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredMasters.map((master, index) => (
                                <motion.div
                                    key={master.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <MasterCard
                                        {...master}
                                        onBookClick={() => onBookClick({
                                            name: master.master.name,
                                            specialty: master.master.title,
                                            imageUrl: master.imageUrl,
                                            portfolio: master.portfolio,
                                            rating: master.rating,
                                            reviews: master.reviews
                                        })}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="flex items-center justify-center h-[calc(100vh-280px)] bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <div className="text-center px-6 py-12 max-w-md">
                            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapIcon className="text-white" size={40} />
                            </div>
                            <h3 className="mb-2">Карта в разработке</h3>
                            <p className="text-gray-600 mb-6">
                                Функция просмотра мастеров на карте скоро будет доступна. Пока используйте режим списка для поиска мастеров.
                            </p>
                            <button
                                onClick={() => setViewMode('list')}
                                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Вернуться к списку
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
