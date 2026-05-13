import {useEffect, useState} from 'react';
import { X, SlidersHorizontal, MapPin, Star, ChevronLeft, Map as MapIcon, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MasterCard } from '../MasterCard/MasterCard';
import {useNavigate, useParams} from "react-router-dom";
import {apiFetch} from "../../api/apiFetch";
import {MapComponent} from "../VK_Maps/map";
import {BookingModal} from "../BookingModal/BookingModal";

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

    const handleBookClick = (masters: any) => {
        setSelectedMaster(masters);
        setShowBookingModal(true);
    };

    const [masters, setMasters] = useState<masters[]>([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const onClose = () =>{
        navigate('/');
    }

    const onBack = () =>{
        navigate(-1);
    }

    useEffect(() => {
        apiFetch(`/categories/${id}/masters`)
            .then(res => {
                if (res.ok) {
                    setMasters(res.data);
                } else {
                    console.error(res);
                }
            })
            .catch(console.error);
    }, [id]);

    const cities = ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург'];

    let filteredMasters = [...masters];

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
                                        master={master}
                                        onBookClick={handleBookClick}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="h-[calc(100vh-280px)] bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                        <MapComponent
                            masters={filteredMasters.map((master) => ({
                                id: master.id,
                                name: `${master.first_name} ${master.last_name}`,
                                specialty: master.bio,
                                imageUrl: master.imageUrl || "https://cdn.profi.ru/xfiles/pfiles/b123b874d639411fa677612262614ad3.jpg-profi_a34-180.jpg",
                                rating: master.rating,
                                reviews: master.reviews,
                                location: master.location,
                                priceFrom: master.price,
                                lat: master.lat,
                                lng: master.lon
                            }))}
                            onMasterSelect={(selectedMapMaster) => {
                                // Находим полного мастера по ID
                                const fullMaster = filteredMasters.find(m => m.id === selectedMapMaster.id);
                                if (fullMaster) {
                                    handleBookClick(fullMaster);
                                }
                            }}
                        />
                    </div>
                )}
            </div>

            {showBookingModal && selectedMaster && (
                <BookingModal
                    master={selectedMaster}
                    onClose={() => setShowBookingModal(false)}
                />
            )}
        </div>
    );
}
