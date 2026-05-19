import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Calendar } from 'lucide-react';
import { apiFetch } from '../../api/apiFetch';
import {hasErrors, validateCreateServiceForm} from "../../utils/validation";

interface Service {
    id: string;
    title: string;
    duration_minutes: number;
    price: number;
    description: string;
    onShowToast?: (message: string, type: 'success' | 'error') => void;
    masterID: string;
}

export function ServiceManager({onShowToast, masterID} : Service) {
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<Service[]>([]);
    const [errors, setErrors] = useState({
        category_id: '',
        description: '',
        duration_minutes: '',
        is_auto_confirm: '',
        price: '',
        title: '',
    });

    const validateForm = (): boolean => {
        const newErrors = validateCreateServiceForm(formData);
        setErrors(newErrors);
        return !hasErrors(newErrors);
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const id = masterID;

        apiFetch(`/masters/${id}/services`)
            .then((res) => {
                if (res.ok) {
                    setServices(res.data);
                } else {
                    console.error(res);
                }
            })
            .catch(console.error);
    }, []);


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
    const [isAddingService, setIsAddingService] = useState(false);

    const [editingService, setEditingService] =
        useState<Service | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        duration_minutes: 60,
        price: 0,
        description: '',
        category_id: '',
        isAutoConfirm: '',
    });

    const openAddService = () => {
        setFormData({
            title: '',
            duration_minutes: 60,
            price: 0,
            description: '',
            category_id: '',
            isAutoConfirm: '',
        });

        setIsAddingService(true);
    };

    const openEditService = (service: Service) => {
        setFormData({
            title: service.title,
            duration_minutes: service.duration_minutes,
            price: service.price,
            description: service.description,
            isAutoConfirm: service.is_auto_confirm,
            category_id: service.category_id,
        });

        setEditingService(service);
    };

    const closeForm = () => {
        setIsAddingService(false);

        setEditingService(null);

        setFormData({
            title: '',
            duration_minutes: 60,
            price: 0,
            description: '',
            category_id: '',
            isAutoConfirm: ''
        });
    };

    const saveService = async () => {
        try {
            const id = user?.id;
            console.log(id);

            if (editingService) {
                // const res = await apiFetch(
                //     `/masters/${id}/services/${editingService.id}`,
                //     {
                //         method: 'PUT',
                //         body: JSON.stringify({
                //             title: formData.title,
                //             duration_minutes: formData.duration_minutes,
                //             price: formData.price,
                //             description: formData.description
                //         })
                //     }
                // );
                //
                // if (!res.ok) {
                //     throw new Error(
                //         res.data?.message || 'Ошибка обновления'
                //     );
                // }
                //
                // setServices((prev) =>
                //     prev.map((service) =>
                //         service.id === editingService.id
                //             ? {
                //                 ...service,
                //                 ...formData
                //             }
                //             : service
                //     )
                // );
            } else {
                if(validateForm()) {
                    const res = await apiFetch(
                        `/masters/${id}/services`,
                        {
                            method: 'POST',
                            body: JSON.stringify({
                                title: formData.title,
                                duration_minutes: parseInt(formData.duration_minutes),
                                price: parseInt(formData.price),
                                description: formData.description,
                                category_id: formData.category_id,
                                lon:0.1,
                                lat:0.1,
                                is_auto_confirm: (formData.isAutoConfirm == "on"),
                                address: "sddsdsdsdsddsd",
                                city: "Москва"
                            })
                        }
                    );

                    if (!res.ok) {
                        throw new Error(
                            res.data?.message || 'Ошибка создания'
                        );
                    }

                    if (onShowToast) {
                        onShowToast(
                            'Услуга успешно создана!',
                            'success'
                        );
                    }

                    setServices((prev) => [...prev, res.data]);
                    closeForm();
                }
            }

        } catch (e) {
            console.error(e);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const deleteService = async (id: string) => {
        try {
            const masterId = user?.id;

            const res = await apiFetch(
                `/masters/${masterId}/services/${id}`,
                {
                    method: 'DELETE'
                }
            );

            if (!res.ok) {
                throw new Error(
                    res.data?.message || 'Ошибка удаления'
                );
            }
            if (onShowToast) {
                onShowToast(
                    'Услуга успешно удалена!',
                    'info'
                );
            }
            setServices((prev) =>
                prev.filter((service) => service.id !== id)
            );
        } catch (e) {
            console.error(e);
        }
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
                                <h3>{service.title}</h3>

                                <p className="text-gray-600 text-sm mb-2">
                                    {service.description}
                                </p>

                                <div className="flex gap-4 text-sm text-gray-500 mb-2">
                                    <span>
                                        {service.duration_minutes} мин
                                    </span>

                                    <span>•</span>

                                    <span>
                                        {service.price} ₽
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar size={14} />
                                    <span>
                                        Услуга доступна для записи
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        openEditService(service)
                                    }
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Edit size={18} />
                                </button>

                                <button
                                    onClick={() =>
                                        deleteService(service.id)
                                    }
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
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2>
                                {editingService
                                    ? 'Редактировать услугу'
                                    : 'Новая услуга'}
                            </h2>

                            <button
                                onClick={closeForm}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-2">
                                    Название услуги
                                </label>

                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                                        errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                    }`}
                                    placeholder="Стрижка женская"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm mb-2">Специализация</label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => updateField('category_id', e.target.value)}
                                    className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500${
                                        errors.category_id ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                    }`}
                                >
                                    <option value="">Выберите специализацию</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="text-red-500 text-sm mt-3">
                                        {errors.category_id }
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-2">
                                        Длительность (мин)
                                    </label>

                                    <input
                                        type="number"
                                        value={formData.duration_minutes}
                                        onChange={(e) => updateField('duration_minutes', e.target.value)}
                                        className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                                            errors.duration_minutes ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                        }`}
                                    />
                                    {errors.duration_minutes && (
                                        <p className="text-red-500 text-sm mt-3">
                                            {errors.duration_minutes }
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm mb-2">
                                        Цена (₽)
                                    </label>

                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => updateField('price', e.target.value)}
                                        className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                                            errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                        }`}
                                    />
                                    {errors.price && (
                                        <p className="text-red-500 text-sm mt-3">
                                            {errors.price }
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isAutoConfirm}

                                        onChange={(e) => updateField('isAutoConfirm', e.target.value)}
                                        className="accent-pink-500 w-5 h-5 mt-0.5 text-pink-600 rounded focus:ring-pink-500"
                                    />

                                    <div>
                                        <p className="font-medium">
                                            Автоподтверждение записи
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Клиенты смогут записываться без ручного подтверждения.
                                        </p>
                                    </div>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm mb-2">
                                    Описание
                                </label>

                                <textarea
                                    value={formData.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-24 ${
                                        errors.duration_minutes ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                    }`}
                                    placeholder="Краткое описание услуги"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-3">
                                        {errors.description }
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={saveService}
                            className="w-full mt-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            {editingService
                                ? 'Сохранить изменения'
                                : 'Добавить услугу'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}