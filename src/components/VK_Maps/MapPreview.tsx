import { MapPin, X, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface MarkerPreviewProps {
    onClose?: () => void;
}

export function MapMarkerPreview({ onClose }: MarkerPreviewProps) {
    const markers = [
        {
            id: '1',
            name: 'Анна Петрова',
            specialty: 'Стилист',
            rating: 4.9,
            imageUrl: 'https://images.unsplash.com/photo-1761839256791-6a93f89fb8b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
            priceFrom: 3500,
            state: 'default'
        },
        {
            id: '2',
            name: 'Мария Соколова',
            specialty: 'Маникюр',
            rating: 4.8,
            imageUrl: 'https://images.unsplash.com/photo-1753285311550-154917dab783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
            priceFrom: 2000,
            state: 'selected'
        },
        {
            id: '3',
            name: 'Елена Волкова',
            specialty: 'Визажист',
            rating: 5.0,
            imageUrl: 'https://images.unsplash.com/photo-1653130029149-9109b115ab9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
            priceFrom: 4500,
            state: 'hover'
        }
    ];

    const renderMarker = (marker: typeof markers[0], position: { top: string; left: string }) => {
        const isSelected = marker.state === 'selected';
        const isHover = marker.state === 'hover';

        return (
            <div
                key={marker.id}
                className="absolute"
                style={{ top: position.top, left: position.left }}
            >
                {/* Маркер - основной пин */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative cursor-pointer group"
                >
                    {/* Пульсация для выбранного маркера */}
                    {isSelected && (
                        <div className="absolute inset-0 -z-10">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-pink-500 rounded-full animate-ping opacity-30"></div>
                        </div>
                    )}

                    {/* Основной маркер */}
                    <div
                        className={`relative w-14 h-14 transition-transform ${
                            isHover ? 'scale-110' : isSelected ? 'scale-110' : 'scale-100'
                        }`}
                    >
                        {/* Тень маркера */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/20 rounded-full blur-sm"></div>

                        {/* Капля маркера */}
                        <div
                            className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden ${
                                isSelected
                                    ? 'ring-4 ring-pink-500'
                                    : isHover
                                        ? 'ring-2 ring-pink-300'
                                        : ''
                            }`}
                        >
                            <img
                                src={marker.imageUrl}
                                alt={marker.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Градиентная накладка */}
                            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent"></div>
                        </div>

                        {/* Хвостик маркера */}
                        <div
                            className={`absolute top-10 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] ${
                                isSelected
                                    ? 'border-t-pink-500'
                                    : 'border-t-white'
                            }`}
                            style={{
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                            }}
                        ></div>

                        {/* Рейтинг бейдж */}
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
                            <Star size={10} fill="white" />
                            <span>{marker.rating}</span>
                        </div>
                    </div>

                    {/* Попап при наведении/выборе */}
                    {(isHover || isSelected) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 z-10"
                        >
                            <div className="p-3">
                                <div className="flex items-start gap-2 mb-2">
                                    <img
                                        src={marker.imageUrl}
                                        alt={marker.name}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm mb-0.5 truncate">{marker.name}</h4>
                                        <p className="text-xs text-gray-600 truncate">{marker.specialty}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs mb-2">
                                    <div className="flex items-center gap-1">
                                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                        <span>{marker.rating}</span>
                                    </div>
                                    <span className="text-pink-600 font-medium">от {marker.priceFrom} ₽</span>
                                </div>
                                <button className="w-full py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg text-xs hover:opacity-90 transition-opacity">
                                    Записаться
                                </button>
                            </div>
                            {/* Стрелка попапа */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-100 z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl mb-1">Макет маркеров для карты</h1>
                        <p className="text-gray-600 text-sm">Дизайн маркеров мастеров на карте</p>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    )}
                </div>
            </div>

            {/* Макет карты */}
            <div className="relative h-[calc(100vh-80px)] bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                {/* Имитация улиц на карте */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-400"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-400"></div>
                    <div className="absolute top-3/4 left-0 right-0 h-px bg-gray-400"></div>
                    <div className="absolute top-0 bottom-0 left-1/4 w-px bg-gray-400"></div>
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-400"></div>
                    <div className="absolute top-0 bottom-0 left-3/4 w-px bg-gray-400"></div>
                </div>

                {/* Водяной знак */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-gray-400/30 text-9xl font-bold select-none">MAP</div>
                </div>

                {/* Маркеры на разных позициях */}
                {renderMarker(markers[0], { top: '30%', left: '25%' })}
                {renderMarker(markers[1], { top: '50%', left: '60%' })}
                {renderMarker(markers[2], { top: '65%', left: '35%' })}

                {/* Легенда */}
                <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg p-4 max-w-sm">
                    <h3 className="mb-3 flex items-center gap-2">
                        <MapPin size={20} className="text-pink-600" />
                        Типы маркеров
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white shadow-md"></div>
                            <div>
                                <p className="font-medium">Обычный маркер</p>
                                <p className="text-xs text-gray-500">Мастер доступен для записи</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-pink-100 rounded-full border-2 border-white shadow-md ring-2 ring-pink-300"></div>
                            <div>
                                <p className="font-medium">При наведении</p>
                                <p className="text-xs text-gray-500">Показывается мини-карточка</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-8 h-8 bg-pink-500 rounded-full border-2 border-white shadow-md ring-4 ring-pink-500"></div>
                                <div className="absolute inset-0 animate-ping bg-pink-500 rounded-full opacity-30"></div>
                            </div>
                            <div>
                                <p className="font-medium">Выбранный маркер</p>
                                <p className="text-xs text-gray-500">Открыта карточка мастера</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Панель стилей */}
                <div className="absolute top-6 right-6 bg-white rounded-xl shadow-lg p-4 max-w-xs">
                    <h3 className="mb-3">Элементы маркера</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-500 to-purple-600"></div>
                            <span>Фото мастера</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                            <span>Рейтинг бейдж</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-white border-2 border-gray-300 rounded-full"></div>
                            <span>Белая обводка</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-200 rounded-sm shadow-sm"></div>
                            <span>Тень маркера</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-pink-500 rounded-full ring-2 ring-pink-300"></div>
                            <span>Кольцо при активации</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-white rounded shadow-lg"></div>
                            <span>Попап-карточка</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
