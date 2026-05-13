import { Star, MapPin, Check } from 'lucide-react';

interface MasterCardProps {
    master: any;
    onBookClick?: (master: any) => void; // Изменяем тип
}export function MasterCard({ master, onBookClick }: MasterCardProps) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer">
            <div className="relative aspect-[3/4]">
                <img
                    src={master?.avatar_url}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-4">
                <h3 className="mb-1">{master.first_name + ' ' + master.last_name}</h3>
                <p className="text-gray-600 text-sm mb-3">{master.bio}</p>

                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{master.rating}</span>
                    </div>
                    <span className="text-gray-400 text-sm">({master.review_count} отзывов)</span>
                </div>

                <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                    <MapPin size={14} />
                    <span>{master.address}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                        <span className="text-gray-500 text-sm">от </span>
                        <span className="text-lg">{master.review_count} ₽</span>
                    </div>
                    <button
                        onClick={() => {onBookClick?.(master)}}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
                    >
                        Записаться
                    </button>
                </div>
            </div>
        </div>
    );
}
