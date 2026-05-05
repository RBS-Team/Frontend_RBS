import { useState } from 'react';
import { Upload, Trash2, X } from 'lucide-react';

export function PortfolioManager() {
    const [portfolioImages, setPortfolioImages] = useState<string[]>([
        'https://images.unsplash.com/photo-1638064432601-18b99cb31acb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1605980625458-21e4d9c29c4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1630695239920-4b5bb84a7c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1574773004910-1eeaabb62b55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    ]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const deleteImage = (index: number) => {
        setPortfolioImages(portfolioImages.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2>Мое портфолио</h2>
                    <span className="text-sm text-gray-500">{portfolioImages.length} фотографий</span>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-pink-500 transition-colors cursor-pointer mb-6">
                    <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                    <h3 className="mb-2">Загрузите фотографии работ</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Перетащите изображения сюда или нажмите для выбора
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG до 10MB каждое</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {portfolioImages.map((image, index) => (
                        <div
                            key={index}
                            className="relative group aspect-square rounded-lg overflow-hidden cursor-pointer"
                            onClick={() => setSelectedImage(image)}
                        >
                            <img
                                src={image}
                                alt={`Работа ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteImage(index);
                                }}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                    ⭐ <strong>Важно:</strong> Качественное портфолио увеличивает количество записей на 60%.
                    Загружайте только лучшие фотографии ваших работ в хорошем качестве.
                </p>
            </div>

            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-white" />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Работа мастера"
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
