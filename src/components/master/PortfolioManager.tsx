import { useRef, useState, useEffect } from 'react';
import { Upload, Trash2, X, Loader2 } from 'lucide-react';
import { apiFetch } from "../../api/apiFetch";

interface PortfolioManagerProps {
    masterID: string;
}

interface PortfolioImage {
    id: string;
    master_id: string;
    url: string;
}

export function PortfolioManager({ masterID }: PortfolioManagerProps) {
    const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const deleteImage = async (photoID: string) => {
        const previousImages = [...portfolioImages];
        setPortfolioImages((prev) => prev.filter((img) => img.id !== photoID));

        try {
            await apiFetch(
                `/masters/${masterID}/portfolio/${photoID}`,
                {
                    method: 'DELETE',
                }
            );
        } catch (err) {
            console.error('Failed to delete image from server:', err);
            setPortfolioImages(previousImages);
        }
    };


    const uploadPortfolio = async (
        masterID: string | number,
        files: File[]
    ) => {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file);
            });

            return await apiFetch(
                `/masters/${masterID}/portfolio`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
        } catch (err) {
            console.error('Portfolio upload failed:', err);
            throw err;
        }
    };

    const fetchPortfolio = async () => {
        try {
            const res = await apiFetch(`/masters/${masterID}/portfolio`);
            if (res && Array.isArray(res.data)) {
                setPortfolioImages(res.data);
            } else if (Array.isArray(res)) {
                setPortfolioImages(res);
            } else {
                console.error('API вернул неверный формат:', res);
                setPortfolioImages([]);
            }
        } catch (err) {
            console.error('Failed to fetch portfolio:', err);
            setPortfolioImages([]);
        }
    };


    useEffect(() => {
        fetchPortfolio();
    }, [masterID]);


    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (files.length > 10) {
            alert('Можно загрузить максимум 10 фотографий');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 10 * 1024 * 1024;
        const validFiles: File[] = [];

        for (const file of Array.from(files)) {
            if (!allowedTypes.includes(file.type)) {
                alert(`${file.name}: неподдерживаемый формат`);
                continue;
            }
            if (file.size > maxSize) {
                alert(`${file.name}: файл больше 10MB`);
                continue;
            }
            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        try {
            setLoading(true);
            const res = await uploadPortfolio(masterID, validFiles);

            // Корректно добавляем картинки после загрузки в зависимости от структуры ответа POST-запроса
            if (res && Array.isArray(res.data)) {
                setPortfolioImages((prev) => [...prev, ...res.data]);
            } else if (res && Array.isArray(res.images)) {
                setPortfolioImages((prev) => [...prev, ...res.images]);
            } else if (Array.isArray(res)) {
                setPortfolioImages((prev) => [...prev, ...res]);
            }
        } catch (err) {
            console.error(err);
            alert('Ошибка загрузки фотографий');
        } finally {
            setLoading(false);
        }
    };

    // Гарантируем безопасность вызовов .length
    const imagesCount = Array.isArray(portfolioImages) ? portfolioImages.length : 0;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Мое портфолио</h2>
                    <span className="text-sm text-gray-500">
                        {imagesCount} фотографий
                    </span>
                </div>

                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-pink-500 transition-colors cursor-pointer mb-6"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mx-auto mb-4 animate-spin text-pink-500" size={48} />
                            <p className="text-sm text-gray-600">Загрузка...</p>
                        </>
                    ) : (
                        <>
                            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                            <h3 className="mb-2 font-medium">Загрузите фотографии работ</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Перетащите изображения сюда или нажмите для выбора
                            </p>
                            <p className="text-xs text-gray-400">PNG, JPG, WebP до 10MB каждое</p>
                        </>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={handleUpload}
                    />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Array.isArray(portfolioImages) && portfolioImages.map((image, index) => (
                        <div
                            key={image.id || index}
                            className="relative group aspect-square rounded-lg overflow-hidden cursor-pointer"
                            onClick={() => setSelectedImage(image.url)}
                        >
                            <img
                                src={image.url}
                                alt={`Работа ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteImage(image.id);
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
                    <img src={selectedImage} alt="Увеличенное изображение" className="max-w-full max-h-full object-contain rounded-lg" />
                </div>
            )}
        </div>
    );
}
