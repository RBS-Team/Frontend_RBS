import {useEffect, useState} from 'react';
import {Upload, Check, ChevronRight, X, Lock, EyeOff, Eye} from 'lucide-react';
import {useNavigate} from "react-router-dom";
import {apiFetch} from "../../api/apiFetch";
import {hasErrors, validateMasterAuthForm} from "../../utils/validation";




export function MasterRegistration() {
    const [step, setStep] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        city: '',
        description: '',
        category_id: '',
        avatar: ''
    });
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        category_id: '',
        password: '',
        description: '',
        city: '',
        address: '',
        avatar: ''
    });
    const navigate = useNavigate();

    const validateForm = (): boolean => {
        const newErrors = validateMasterAuthForm(formData);
        setErrors(newErrors);
        if (
            newErrors.firstName ||
            newErrors.lastName ||
            newErrors.email ||
            newErrors.phone
        ) {
            setStep(1);
        }

        else if (
            newErrors.password ||
            newErrors.description
        ) {
            setStep(2);
        }

        else if (
            newErrors.city ||
            newErrors.address ||
            newErrors.avatar
        ) {
            setStep(3);
        }
        console.log(newErrors);
        return !hasErrors(newErrors);
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleAuthSuccess = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/master/dashboard');
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const imageUrl = URL.createObjectURL(file);

        setAvatarPreview(imageUrl);

        setFormData(prev => ({
            ...prev,
            avatar: file
        }));

        if (errors.avatar) {
            setErrors(prev => ({
                ...prev,
                avatar: ''
            }));
        }
    };

    const uploadAvatar = async (masterID: string | number, file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            console.log("FormData entry:", formData.get('file'));

            const res = await apiFetch(`/masters/${masterID}/avatar`, {
                method: 'PUT',
                body: formData,
            });

            if (!res.ok) {
                const errorText = await res.text?.();
                throw new Error(errorText || 'Ошибка загрузки аватара');
            }

            return await res.json?.();
        } catch (err) {
            console.error("Avatar upload failed:", err);
            throw err;
        }
    };


    const handleFinish = async () => {
        setLoading(true);
        setError(null);
        console.log(validateForm())
        if (validateForm()) {
        try {
            const addressQuery = encodeURIComponent(formData.city + " " + formData.address);
            const apiKey = "6a061cd8ebce7327576438klp345fcb";

            const vkResponse = await fetch(
                `https://geocode.maps.co/search?q=${addressQuery}&api_key=${apiKey}`,
            );

            if (!vkResponse.ok) {
                setErrors(prev => ({
                    ...prev,
                    address: 'Ошибка выполнения запроса'
                }));
            }

            const vkData = await vkResponse.json();

            if (!vkData || vkData.length === 0) {
                setErrors(prev => ({
                    ...prev,
                    address: 'Адрес не найден',
                    city: 'Адрес не найден'
                }));
            }

            const location = vkData[0];

            const lat = parseFloat(location.lat);
            const lon = parseFloat(location.lon);

            const url = "/master/register";

            const payload = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                lon,
                lat,
                category_id: formData.category_id,
                address: formData.city + " " + formData.address,
                city: formData.city,
                password: formData.password,
                phone: formData.phone,
                timezone: "Europe/London",
                role: "master",
            };

            const res = await apiFetch(url, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(res.data?.message || "Ошибка запроса");
            }

            const data = await res.data;

            handleAuthSuccess({
                id: data.user_id,
                master_id: data.master_id,
                role: "master",
            });

            if (formData.avatar instanceof File) {
                try {
                    await uploadAvatar(data.master_id, formData.avatar);
                } catch (e) {
                    console.error("Avatar upload failed:", e);
                    setErrors(prev => ({
                        ...prev,
                        avatar: 'Не удалось загрузить аватар'
                    }));
                }
            }

        } catch (err: any) {
            setError(err.message);
            console.error(err.message);
        } finally {
            setLoading(false);
        }
        }
    };

    const onClose = () => {
        navigate(-1);
    }

    const [categories, setCategories] = useState([]);

    const [showPassword, setShowPassword] = useState(false);

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
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="relative">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors absolute right-0"
                        >
                            <X size={24}/>
                        </button>
                    </div>
                    <div className="mb-8">
                        <h1 className="text-center mb-2">Регистрация мастера</h1>
                        <p className="text-center text-gray-600">Шаг {step} из 3</p>
                    </div>

                    <div className="flex gap-2 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`flex-1 h-2 rounded-full transition-colors ${
                                    i <= step ? 'bg-pink-500' : 'bg-gray-200'
                                }`}
                            />
                        ))}
                    </div>

                    {step === 1 && (
                        <div className="space-y-4">
                            <h3>Личная информация</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-2">Имя</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => updateField('firstName', e.target.value)}
                                        className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                                            errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                        }`}
                                        placeholder="Анна"
                                    />
                                    {errors.firstName && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.firstName}
                                    </p>
                                )}

                                </div>
                                <div>
                                    <label className="block text-sm mb-2">Фамилия</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => updateField('lastName', e.target.value)}
                                        className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                                            errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                        }`}
                                        placeholder="Петрова"
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.lastName}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                    }`}
                                    placeholder="anna@example.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email}
                                    </p>
                                )}

                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-2">Пароль</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => updateField('password', e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className={`w-full pl-12 pr-12 py-4  border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all${
                                            errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="cursor-pointer"  size={20} /> : <Eye className="cursor-pointer" size={20} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h3>Профессиональная информация</h3>
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
                            <div>
                                <label className="block text-sm mb-2">Телефон</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                                        errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                    }`}
                                    placeholder="+7 (900) 123-45-67"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm mb-2">О себе</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-32${
                                        errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                    }`}
                                    placeholder="Расскажите о себе, своих навыках и достижениях..."
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <h3>Местоположение</h3>
                            <div>
                                <label className="block text-sm mb-2">Город</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => updateField('city', e.target.value)}
                                    className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500${
                                        errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                    }`}
                                    placeholder="Москва"
                                />
                                {errors.city && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.city}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm mb-2">Адрес студии/салона</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => updateField('address', e.target.value)}
                                    className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500${
                                        errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
                                    }`}
                                    placeholder="ул. Тверская, д. 1"
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.address}
                                    </p>
                                )}
                            </div>
                            <label
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer block ${
                                    errors.avatar
                                        ? 'border-red-500'
                                        : 'border-gray-300 hover:border-pink-500'
                                }`}
                            >
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />

                                {avatarPreview ? (
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar preview"
                                            className="w-32 h-32 object-cover rounded-full mb-4 border"
                                        />

                                        <p className="text-sm text-gray-600">
                                            Нажмите чтобы изменить фото
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload
                                            className="mx-auto mb-3 text-gray-400"
                                            size={32}
                                        />

                                        <p className="text-sm text-gray-600 mb-1">
                                            Загрузите фото профиля
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            PNG, JPG до 5MB
                                        </p>
                                    </>
                                )}

                                {errors.avatar && (
                                    <p className="text-red-500 text-sm mt-3">
                                        {errors.avatar}
                                    </p>
                                )}
                            </label>
                        </div>
                    )}

                    <div className="flex gap-4 mt-8">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Назад
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (step < 3) {
                                    setStep(step + 1);
                                } else {
                                    handleFinish();
                                }
                            }}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {step === 3 ? 'Завершить регистрацию' : 'Далее'}
                            <ChevronRight size={20}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
