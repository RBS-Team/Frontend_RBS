import { Star, MapPin, Check } from 'lucide-react';

interface MasterCardProps {
    name: string;
    specialty: string;
    imageUrl: string;
    rating: number;
    reviews: number;
    location: string;
    priceFrom: number;
    isVerified?: boolean;
    onBookClick?: () => void;
    master: object;
    title: string;
}

export function MasterCard({
                               master,
                               title,
                               location,
                               price,
                               isVerified = false,
                               onBookClick
                           }: MasterCardProps) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer">
            <div className="relative aspect-[3/4]">
                <img
                    // src={imageUrl}
                    src="https://images.unsplash.com/photo-1763048208932-cbe149724374?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                    alt={master.name}
                    className="w-full h-full object-cover"
                />
                {isVerified && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1">
                        <Check size={16} />
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="mb-1">{master.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{title}</p>

                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{master.rating}</span>
                    </div>
                    <span className="text-gray-400 text-sm">({master.review_count} отзывов)</span>
                </div>

                <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                    <MapPin size={14} />
                    <span>{location}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                        <span className="text-gray-500 text-sm">от </span>
                        <span className="text-lg">{price} ₽</span>
                    </div>
                    <button
                        onClick={onBookClick}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
                    >
                        Записаться
                    </button>
                </div>
            </div>
        </div>
    );
}
