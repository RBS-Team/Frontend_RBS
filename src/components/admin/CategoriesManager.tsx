import {useEffect, useState} from 'react';
import { Plus, Edit, Trash2, Upload, X, Scissors, Sparkles, Heart, Eye, Hand, Flower, Smile, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {apiFetch} from "../../api/apiFetch";

interface Category {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    mastersCount: number;
    icon: string;
    color: string;
}

interface CategoriesManagerProps {
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

export function CategoriesManager({ onShowToast }: CategoriesManagerProps) {
    const [categories, setCategories] = useState<Category[]>([
    ]);



    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: 'Scissors',
        color: 'from-pink-500 to-rose-500'
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        apiFetch("/categories")
            .then(res => {
                if (res.ok) {
                    setCategories(res.data);
                } else {
                    console.error(res);
                }
            })
            .catch(console.error);
    }, []);

    console.log(categories);

    const icons = [
        { name: 'Scissors', component: Scissors, label: 'Ножницы' },
        { name: 'Hand', component: Hand, label: 'Рука' },
        { name: 'Palette', component: Palette, label: 'Палитра' },
        { name: 'Sparkles', component: Sparkles, label: 'Звезды' },
        { name: 'Eye', component: Eye, label: 'Глаз' },
        { name: 'Heart', component: Heart, label: 'Сердце' },
        { name: 'Flower', component: Flower, label: 'Цветок' },
        { name: 'Smile', component: Smile, label: 'Улыбка' }
    ];

    const colors = [
        { name: 'from-pink-500 to-rose-500', label: 'Розовый' },
        { name: 'from-purple-500 to-indigo-500', label: 'Фиолетовый' },
        { name: 'from-orange-500 to-red-500', label: 'Оранжевый' },
        { name: 'from-teal-500 to-cyan-500', label: 'Бирюзовый' },
        { name: 'from-violet-500 to-purple-500', label: 'Сиреневый' },
        { name: 'from-green-500 to-emerald-500', label: 'Зеленый' },
        { name: 'from-blue-500 to-sky-500', label: 'Синий' },
        { name: 'from-fuchsia-500 to-pink-500', label: 'Фуксия' }
    ];

    const handleImageUpload = (file: File) => {
        if (!file.type.startsWith('image/')) {
            if (onShowToast) {
                onShowToast('Пожалуйста, выберите изображение', 'error');
            }
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const openCreateModal = () => {
        setEditingCategory(null);
        setFormData({
            title: '',
            description: '',
            icon: 'Scissors',
            color: 'from-pink-500 to-rose-500'
        });
        setImageFile(null);
        setImagePreview('');
        setShowModal(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            title: category.title,
            description: category.description,
            icon: category.icon,
            color: category.color
        });
        setImagePreview(category.imageUrl);
        setImageFile(null);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        // if (!formData.title.trim()) {
        //     if (onShowToast) {
        //         onShowToast('Введите название категории', 'error');
        //     }
        //     return;
        // }
        //
        // if (!formData.description.trim()) {
        //     if (onShowToast) {
        //         onShowToast('Введите описание категории', 'error');
        //     }
        //     return;
        // }
        //
        // if (!imagePreview) {
        //     if (onShowToast) {
        //         onShowToast('Загрузите изображение категории', 'error');
        //     }
        //     return;
        // }

        if (editingCategory) {
            function base64ToBlob(base64, type) {
                const byteCharacters = atob(base64.split(',')[1]);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                return new Blob([byteArray], { type: type });
            }
            const imageBlob = base64ToBlob(imagePreview, 'image/jpeg');
            try {
                const formData = new FormData();
                formData.append('file', imageBlob);
                console.log("FormData entry:", formData.get('file'));
                await apiFetch(`/categories/${editingCategory.id}/avatar`, {
                    method: 'PUT',
                    body: formData
                });

                setCategories(categories.map(cat =>
                    cat.id === editingCategory.id
                        ? {
                            ...cat,
                            ...formData,
                            imageUrl: imagePreview
                        }
                        : cat
                ));

                if (onShowToast) {
                    onShowToast('Категория успешно обновлена', 'success');
                }
            } catch (error) {
                if (onShowToast) {
                    onShowToast('Ошибка при обновлении изображения категории', 'error');
                }
                return;
            }
        } else {
            const newCategory: Category = {
                id: Date.now().toString(),
                ...formData,
                imageUrl: imagePreview,
                mastersCount: 0
            };
            setCategories([...categories, newCategory]);
            if (onShowToast) {
                onShowToast('Категория успешно создана', 'success');
            }
        }

        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
            setCategories(categories.filter(cat => cat.id !== id));
            if (onShowToast) {
                onShowToast('Категория удалена', 'success');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="mb-1">Управление категориями</h2>
                    <p className="text-gray-600">Создавайте и редактируйте категории услуг</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                    <Plus size={20} />
                    Добавить категорию
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                    const IconComponent = icons.find(i => i.name === category.icon)?.component || Scissors;
                    return (
                        <div key={category.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                                <img src={category.avatar_url} alt={category.name} className="w-full h-full object-cover" />
                                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-40`} />
                                <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                    <IconComponent className="text-white" size={24} />
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="mb-2">{category.name}</h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <span>{category.mastersCount} мастеров</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(category)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <Edit size={16} />
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                                <h2>{editingCategory ? 'Редактировать категорию' : 'Создать категорию'}</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm mb-2">Изображение категории</label>
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-colors ${
                                            isDragging ? 'border-pink-500 bg-pink-50' : 'border-gray-300'
                                        }`}
                                    >
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                                                <button
                                                    onClick={() => {
                                                        setImagePreview('');
                                                        setImageFile(null);
                                                    }}
                                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center h-64 cursor-pointer hover:bg-gray-50 transition-colors">
                                                <Upload size={48} className="text-gray-400 mb-4" />
                                                <p className="text-gray-600 mb-2">Перетащите изображение сюда</p>
                                                <p className="text-sm text-gray-500 mb-4">или</p>
                                                <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm">Выбрать файл</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileInput}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm mb-2">Название категории</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Например: Парикмахерские услуги"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm mb-2">Описание</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Краткое описание категории"
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm mb-2">Иконка</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {icons.map((icon) => {
                                            const Icon = icon.component;
                                            return (
                                                <button
                                                    key={icon.name}
                                                    onClick={() => setFormData({ ...formData, icon: icon.name })}
                                                    className={`p-4 border-2 rounded-xl transition-all ${
                                                        formData.icon === icon.name
                                                            ? 'border-pink-500 bg-pink-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <Icon size={24} className="mx-auto mb-1" />
                                                    <p className="text-xs text-center">{icon.label}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm mb-2">Цветовая схема</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {colors.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => setFormData({ ...formData, color: color.name })}
                                                className={`h-12 rounded-xl bg-gradient-to-r ${color.name} ${
                                                    formData.color === color.name ? 'ring-4 ring-pink-500 ring-offset-2' : ''
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        {editingCategory ? 'Сохранить' : 'Создать'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
