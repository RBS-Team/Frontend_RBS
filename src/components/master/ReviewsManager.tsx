import { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Send, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface Review {
    id: string;
    clientName: string;
    clientAvatar?: string;
    service: string;
    rating: number;
    date: string;
    comment: string;
    response?: string;
    helpful: number;
}

export function ReviewsManager() {
    const [reviews, setReviews] = useState<Review[]>([
        {
            id: '1',
            clientName: 'Анна Петрова',
            service: 'Стрижка женская',
            rating: 5,
            date: '2026-04-28',
            comment: 'Прекрасная работа! Мастер очень внимательная, все сделала именно так, как я хотела. Обязательно приду еще!',
            helpful: 12
        },
        {
            id: '2',
            clientName: 'Мария Сидорова',
            service: 'Окрашивание',
            rating: 5,
            date: '2026-04-25',
            comment: 'Шикарное окрашивание! Цвет получился ровно таким, как на фото. Спасибо большое!',
            response: 'Спасибо за отзыв! Рада, что вам понравилось 💖',
            helpful: 8
        },
        {
            id: '3',
            clientName: 'Елена Иванова',
            service: 'Стрижка + укладка',
            rating: 4,
            date: '2026-04-20',
            comment: 'Хорошая работа, но немного долго ждала начала процедуры. В целом результатом довольна.',
            helpful: 5
        },
        {
            id: '4',
            clientName: 'Ольга Смирнова',
            service: 'Маникюр',
            rating: 5,
            date: '2026-04-15',
            comment: 'Отличный маникюр, держится уже две недели! Очень аккуратная работа.',
            response: 'Благодарю за доверие! Всегда рада вас видеть 🌸',
            helpful: 15
        },
        {
            id: '5',
            clientName: 'Татьяна Козлова',
            service: 'Укладка',
            rating: 5,
            date: '2026-04-10',
            comment: 'Супер! Укладка держалась весь день, несмотря на погоду. Мастер - профессионал!',
            helpful: 7
        }
    ]);

    const [responseTexts, setResponseTexts] = useState<{ [key: string]: string }>({});

    const handleAddResponse = (reviewId: string) => {
        const text = responseTexts[reviewId];
        if (!text || !text.trim()) return;

        setReviews(reviews.map(r =>
            r.id === reviewId ? { ...r, response: text } : r
        ));
        setResponseTexts({ ...responseTexts, [reviewId]: '' });
    };

    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    const totalReviews = reviews.length;
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: reviews.filter(r => r.rating === rating).length,
        percentage: (reviews.filter(r => r.rating === rating).length / totalReviews) * 100
    }));

    return (
        <div>
            <div className="mb-6">
                <h2 className="mb-2">Отзывы клиентов</h2>
                <p className="text-gray-600">Просматривайте отзывы и отвечайте на них</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <Star className="text-yellow-300" size={32} fill="currentColor" />
                        <div>
                            <p className="text-4xl">{averageRating.toFixed(1)}</p>
                            <p className="text-white/80 text-sm">Средний рейтинг</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <MessageSquare className="text-pink-600" size={32} />
                        <div>
                            <p className="text-4xl">{totalReviews}</p>
                            <p className="text-gray-600 text-sm">Всего отзывов</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="text-green-600" size={32} />
                        <div>
                            <p className="text-4xl">{((reviews.filter(r => r.rating >= 4).length / totalReviews) * 100).toFixed(0)}%</p>
                            <p className="text-gray-600 text-sm">Положительных</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                <h3 className="mb-4">Распределение оценок</h3>
                <div className="space-y-3">
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                        <div key={rating} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-20">
                                <span className="text-sm">{rating}</span>
                                <Star size={16} className="text-yellow-500" fill="currentColor" />
                            </div>
                            <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full transition-all"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {reviews.map((review) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-xl p-6"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white">
                                    {review.clientName[0]}
                                </div>
                                <div>
                                    <h4 className="mb-1">{review.clientName}</h4>
                                    <p className="text-sm text-gray-600">{review.service}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                                            fill={i < review.rating ? 'currentColor' : 'none'}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500">
                                    {new Date(review.date).toLocaleDateString('ru-RU', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-3">{review.comment}</p>

                        {review.response ? (
                            <div className="bg-pink-50 rounded-lg p-4 border-l-4 border-pink-500">
                                <p className="text-sm text-gray-600 mb-1">Ваш ответ:</p>
                                <p className="text-gray-800">{review.response}</p>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-2">Ответить на отзыв:</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={responseTexts[review.id] || ''}
                                        onChange={(e) => setResponseTexts({ ...responseTexts, [review.id]: e.target.value })}
                                        placeholder="Напишите ответ..."
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAddResponse(review.id);
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={() => handleAddResponse(review.id)}
                                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                                    >
                                        <Send size={18} />
                                        Отправить
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <ThumbsUp size={16} />
                                <span>{review.helpful} человек считают это полезным</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
