import { useState } from 'react';
import { Plus, Edit, Trash2, X, Clock, Calendar } from 'lucide-react';

interface ServiceSchedule {
    day: string;
    enabled: boolean;
    slots: string[];
}

interface Service {
    id: string;
    name: string;
    duration: number;
    price: number;
    description: string;
    schedule: ServiceSchedule[];
}

const defaultSchedule: ServiceSchedule[] = [
    { day: 'Пн', enabled: true, slots: [] },
    { day: 'Вт', enabled: true, slots: [] },
    { day: 'Ср', enabled: true, slots: [] },
    { day: 'Чт', enabled: true, slots: [] },
    { day: 'Пт', enabled: true, slots: [] },
    { day: 'Сб', enabled: true, slots: [] },
    { day: 'Вс', enabled: false, slots: [] }
];

export function ServiceManager() {
    const [services, setServices] = useState<Service[]>([
        {
            id: '1',
            name: 'Стрижка женская',
            duration: 60,
            price: 3500,
            description: 'Классическая стрижка',
            schedule: defaultSchedule
        },
        {
            id: '2',
            name: 'Окрашивание',
            duration: 120,
            price: 8000,
            description: 'Полное окрашивание волос',
            schedule: defaultSchedule
        },
        {
            id: '3',
            name: 'Укладка',
            duration: 45,
            price: 2500,
            description: 'Профессиональная укладка',
            schedule: defaultSchedule
        }
    ]);
    const [isAddingService, setIsAddingService] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        duration: 60,
        price: 0,
        description: '',
        schedule: defaultSchedule
    });
    const [showSchedule, setShowSchedule] = useState(false);

    const openAddService = () => {
        setFormData({ name: '', duration: 60, price: 0, description: '', schedule: defaultSchedule });
        setIsAddingService(true);
        setShowSchedule(false);
    };

    const openEditService = (service: Service) => {
        setFormData(service);
        setEditingService(service);
        setShowSchedule(false);
    };

    const closeForm = () => {
        setIsAddingService(false);
        setEditingService(null);
        setFormData({ name: '', duration: 60, price: 0, description: '', schedule: defaultSchedule });
        setShowSchedule(false);
    };

    const toggleDay = (dayIndex: number) => {
        const newSchedule = [...formData.schedule];
        newSchedule[dayIndex].enabled = !newSchedule[dayIndex].enabled;
        setFormData({ ...formData, schedule: newSchedule });
    };

    const updateDayTime = (dayIndex: number, time: string, action: 'add' | 'remove') => {
        const newSchedule = [...formData.schedule];
        if (action === 'add') {
            if (!newSchedule[dayIndex].slots.includes(time)) {
                newSchedule[dayIndex].slots = [...newSchedule[dayIndex].slots, time].sort();
            }
        } else {
            newSchedule[dayIndex].slots = newSchedule[dayIndex].slots.filter(t => t !== time);
        }
        setFormData({ ...formData, schedule: newSchedule });
    };

    const getAvailableTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour < 21; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                slots.push(time);
            }
        }
        return slots;
    };

    const saveService = () => {
        if (editingService) {
            setServices(services.map(s => s.id === editingService.id ? { ...formData, id: s.id } : s));
        } else {
            setServices([...services, { ...formData, id: Date.now().toString() }]);
        }
        closeForm();
    };

    const deleteService = (id: string) => {
        setServices(services.filter(s => s.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2>Мои услуги</h2>
                    <button
                        onClick={openAddService}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <Plus size={20} />
                        Добавить услугу
                    </button>
                </div>

                <div className="grid gap-4">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-pink-300 transition-colors"
                        >
                            <div className="flex-1">
                                <h3>{service.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                                <div className="flex gap-4 text-sm text-gray-500 mb-2">
                                    <span>{service.duration} мин</span>
                                    <span>•</span>
                                    <span>{service.price} ₽</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar size={14} />
                                    <span>
                    {service.schedule.filter(d => d.enabled).map(d => d.day).join(', ') || 'График не настроен'}
                  </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditService(service)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => deleteService(service.id)}
                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {(isAddingService || editingService) && (
                <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-3xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2>{editingService ? 'Редактировать услугу' : 'Новая услуга'}</h2>
                            <button onClick={closeForm} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex gap-2 mb-6 border-b border-gray-200">
                            <button
                                onClick={() => setShowSchedule(false)}
                                className={`px-4 py-2 relative ${
                                    !showSchedule ? 'text-pink-600' : 'text-gray-500'
                                }`}
                            >
                                Основная информация
                                {!showSchedule && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"></div>}
                            </button>
                            <button
                                onClick={() => setShowSchedule(true)}
                                className={`px-4 py-2 relative flex items-center gap-2 ${
                                    showSchedule ? 'text-pink-600' : 'text-gray-500'
                                }`}
                            >
                                <Clock size={16} />
                                График работы
                                {showSchedule && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"></div>}
                            </button>
                        </div>

                        {!showSchedule ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm mb-2">Название услуги</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="Стрижка женская"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm mb-2">Длительность (мин)</label>
                                        <input
                                            type="number"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-2">Цена (₽)</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm mb-2">Описание</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-24"
                                        placeholder="Краткое описание услуги"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 mb-4">
                                    Выберите дни недели и доступные временные слоты для этой услуги
                                </p>

                                {formData.schedule.map((daySchedule, dayIndex) => (
                                    <div key={daySchedule.day} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <input
                                                type="checkbox"
                                                checked={daySchedule.enabled}
                                                onChange={() => toggleDay(dayIndex)}
                                                className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                                            />
                                            <span className={daySchedule.enabled ? 'font-medium' : 'text-gray-400'}>
                        {daySchedule.day}
                      </span>
                                        </div>

                                        {daySchedule.enabled && (
                                            <div>
                                                <div className="grid grid-cols-6 gap-2 mb-2">
                                                    {getAvailableTimeSlots().map((slot) => (
                                                        <button
                                                            key={slot}
                                                            onClick={() => updateDayTime(
                                                                dayIndex,
                                                                slot,
                                                                daySchedule.slots.includes(slot) ? 'remove' : 'add'
                                                            )}
                                                            className={`px-2 py-1 text-xs rounded transition-colors ${
                                                                daySchedule.slots.includes(slot)
                                                                    ? 'bg-pink-500 text-white'
                                                                    : 'bg-gray-100 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            {slot}
                                                        </button>
                                                    ))}
                                                </div>
                                                {daySchedule.slots.length === 0 && (
                                                    <p className="text-xs text-gray-500">Выберите временные слоты</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={saveService}
                            className="w-full mt-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            {editingService ? 'Сохранить изменения' : 'Добавить услугу'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
