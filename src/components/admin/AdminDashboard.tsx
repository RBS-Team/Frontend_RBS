import {useEffect, useState} from 'react';
import { LogOut, LayoutGrid, Users, FileText, BarChart3, Plus } from 'lucide-react';
import { CategoriesManager } from './CategoriesManager';
import { MastersManager } from './MasterManager';
import { BookingsManager } from './BookingManager';
import { AdminStats } from './AdminStats';
import {useNavigate} from "react-router-dom";
import {apiFetch} from "../../api/apiFetch";

type AdminTab = 'categories' | 'masters' | 'bookings' | 'stats';

export function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<AdminTab>('categories');
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    const tabs = [
        { id: 'categories' as AdminTab, label: 'Категории', icon: LayoutGrid },
        { id: 'masters' as AdminTab, label: 'Мастера', icon: Users },
        { id: 'bookings' as AdminTab, label: 'Записи', icon: FileText },
        { id: 'stats' as AdminTab, label: 'Статистика', icon: BarChart3 }
    ];

    const onLogout = () =>{
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



    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg"></div>
                            <div>
                                <h1 className="text-xl">Админ-панель</h1>
                                <p className="text-xs text-gray-500">BeautyPro</p>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                            Выйти
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap transition-colors relative ${
                                            activeTab === tab.id
                                                ? 'text-pink-600 bg-pink-50'
                                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Icon size={20} />
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-6">
                        {activeTab === 'categories' && <CategoriesManager />}
                        {activeTab === 'masters' && <MastersManager />}
                        {activeTab === 'bookings' && <BookingsManager />}
                        {activeTab === 'stats' && <AdminStats />}
                    </div>
                </div>
            </div>
        </div>
    );
}
