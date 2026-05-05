import {useEffect, useMemo, useState} from 'react';
import {Search, X, Scissors, Sparkles, Heart, Eye, Hand, Flower, Smile, Palette, Wand2} from 'lucide-react';
import { motion } from 'motion/react';
import {useNavigate} from "react-router-dom";
import {apiFetch} from "../../api/apiFetch";

interface Category {
    title: string;
    description: string;
    imageUrl: string;
    mastersCount: number;
    icon: any;
    color: string;
}



export function CategoriesView() {
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const onCategorySelect = (id) =>{
        navigate("/category/" + id);
    }

    const onClose = () => {
        navigate(-1);
    }

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

    const categoryStyles = [
        { color: 'from-pink-500 to-rose-500', icon: Scissors },
        { color: 'from-purple-500 to-indigo-500', icon: Hand },
        { color: 'from-orange-500 to-red-500', icon: Palette },
        { color: 'from-teal-500 to-cyan-500', icon: Sparkles },
        { color: 'from-violet-500 to-purple-500', icon: Eye },
        { color: 'from-green-500 to-emerald-500', icon: Heart },
        { color: 'from-blue-500 to-sky-500', icon: Flower },
        { color: 'from-fuchsia-500 to-pink-500', icon: Smile },
        { color: 'from-amber-500 to-yellow-500', icon: Wand2 }
    ];



    const getStableIndex = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };


    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1>Все категории услуг</h1>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Поиск услуг..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <p className="text-gray-600">
                        Найдено категорий: <span className="font-medium text-gray-900">{filteredCategories.length}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category, index) =>{
                        const stableIndex = getStableIndex(category.name);
                        const currentStyle = categoryStyles[stableIndex % categoryStyles.length];
                        const Icon = currentStyle.icon;

                        return (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                            onClick={() => onCategorySelect(category.id)}
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    // src={category.imageUrl}
                                    src="https://images.unsplash.com/photo-1619367901998-73b3a70b3898?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${currentStyle.color} opacity-40 group-hover:opacity-50 transition-opacity`} />
                                <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${currentStyle.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                    <Icon className="text-white" size={24} />
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="mb-2 group-hover:text-pink-600 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {category.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            👤
                                        </div>
                                        <span>{/*category.mastersCount*/} 1924 мастеров</span>
                                    </div>

                                    <button className="text-sm text-pink-600 hover:text-pink-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Смотреть
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                        );
                    })}
                </div>

                {filteredCategories.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" size={40} />
                        </div>
                        <h3 className="mb-2">Ничего не найдено</h3>
                        <p className="text-gray-600">Попробуйте изменить поисковый запрос</p>
                    </div>
                )}

                <div className="mt-12 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-100">
                    <div className="text-center">
                        <h3 className="mb-2">Не нашли нужную категорию?</h3>
                        <p className="text-gray-600 mb-6">
                            Свяжитесь с нами, и мы поможем найти идеального мастера для ваших нужд
                        </p>
                        <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity">
                            Связаться с нами
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
