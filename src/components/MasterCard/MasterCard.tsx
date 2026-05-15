import { Star, MapPin, ChevronLeft, Users, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from "../../api/apiFetch";
import defaultAvatar from '../../static/imgs/avatarka.jpg';

interface PortfolioItem {
    id: string;
    master_id: string;
    url: string;
}

interface MasterCardProps {
    master: any;
    onBookClick?: (master: any) => void;
}

export function MasterCard({ master, onBookClick }: MasterCardProps) {
    // 1. Инициализируем стейт пустым массивом объектов нужного типа
    const [images, setImages] = useState<PortfolioItem[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // 2. Исправляем вложенность useEffect и зависимости
    useEffect(() => {
        if (!master?.id) return;

        setLoading(true);
        apiFetch(`/masters/${master.id}/portfolio`)
            .then((res) => {
                if (res.ok) {
                    const items = res.data.items || res.data;
                    // Проверяем, что пришел массив, иначе записываем пустой массив
                    setImages(Array.isArray(items) ? items : []);
                } else {
                    console.error(res);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [master.id]);

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (images.length === 0) return;
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (images.length === 0) return;
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Заглушка, если у мастера нет фото в портфолио
    const currentImageUrl = images[currentImageIndex]?.url || 'https://placehold.co';
    const fullName = `${master.first_name || ''} ${master.last_name || ''}`.trim() || 'Без имени';

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer">
            <div className="relative aspect-[3/4] bg-gray-100 flex flex-col justify-center">
                {loading ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        Загрузка...
                    </div>
                ) : images.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users size={40} className="text-purple-600" />
                        </div>
                        <h3 className="mb-2 font-medium text-gray-900">Портфолио не найдено</h3>
                    </div>
                ) : (
                    /* Слайдер, если фотографии загружены */
                    <>
                        <img
                            src={currentImageUrl}
                            alt={fullName}
                            className="w-full h-full object-cover"
                        />
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center z-10"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center z-10"
                                >
                                    <ChevronRight size={20} />
                                </button>

                                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentImageIndex(index);
                                            }}
                                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                                                index === currentImageIndex
                                                    ? 'bg-white w-4'
                                                    : 'bg-white/50 hover:bg-white/75'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                        <img
                            src={master.avatar_url || defaultAvatar}
                            alt={name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"/>
                    <div className="flex-1 min-w-0">
                        <h3 className="mb-0.5 truncate">{fullName}</h3>
                        <p className="text-gray-600 text-sm truncate">{master.bio}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{master.rating || 0}</span>
                    </div>
                    <span className="text-gray-400 text-sm">({master.review_count || 0} отзывов)</span>
                </div>

                <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                    <MapPin size={14} />
                    <span className="truncate">{master.address || 'Адрес не указан'}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                        <span className="text-gray-500 text-sm">от </span>
                        <span className="text-lg font-bold">{master.min_price || 0} ₽</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onBookClick?.(master);
                        }}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium"
                    >
                        Записаться
                    </button>
                </div>
            </div>
        </div>
    );
}
