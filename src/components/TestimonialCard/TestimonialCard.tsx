import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
    name: string;
    avatar: string;
    rating: number;
    text: string;
    service: string;
    masterName: string;
}

export function TestimonialCard({ name, avatar, rating, text, service, masterName }: TestimonialCardProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-4 mb-4">
                <img
                    src={avatar}
                    alt={name}
                    className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1">
                    <h4 className="mb-1">{name}</h4>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                                key={index}
                                size={14}
                                className={index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                        ))}
                    </div>
                </div>
                <Quote size={24} className="text-pink-200" />
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">{text}</p>
            <div className="text-sm text-gray-500">
                <span>{service}</span> • <span className="text-pink-600">{masterName}</span>
            </div>
        </div>
    );
}
