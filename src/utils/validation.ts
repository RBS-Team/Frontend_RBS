export interface ValidationErrors {
    [key: string]: string;
}

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};





export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+[1-9][0-9]{6,14}$/;
    return phoneRegex.test(phone);
};

export const getAddressError = (address: string): string => {
    if (!validateRequired(address)) {
        return 'Введите адрес';
    }
    if (address.trim().length < 2) {
        return 'Адрес должен содержать минимум 2 символа';
    }

    if (address.trim().length > 300) {
        return 'Адрес должен содержать не более 300 символов';
    }



    return '';
};

export const getCityError = (city: string): string => {
    if (!validateRequired(city)) {
        return 'Введите город';
    }
    if (city.trim().length < 2) {
        return 'Название города должно содержать минимум 2 символа';
    }

    if (city.trim().length > 100) {
        return 'Название города должно содержать не более 100 символов';
    }


    return '';
};

export const getBioError = (bio: string): string => {
    if (!validateRequired(bio)) {
        return 'Введите информацию о себе';
    }

    if (bio.trim().length < 10) {
        return 'Описание должно содержать минимум 10 символов';
    }

    if (bio.trim().length > 500) {
        return 'Описание должно содержать не более 500 символов';
    }

    return '';
};

export const getAvatarError = (avatar: string): string => {
    const MAX_AVATAR_SIZE = 5242880;
    if (!validateRequired(avatar)) {
        return 'Загрузите аватар';
    }

    if (avatar.size > MAX_AVATAR_SIZE) {
        return 'Максимальный размер файла — 5 МБ';
    }


    return '';
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 6 && password.length <= 100;
};

export const validateName = (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length < 70;
};

export const validateRequired = (
    value?: string | File | null
): boolean => {

    if (value instanceof File) {
        return true;
    }

    if (typeof value === 'string') {
        return !!value.trim();
    }

    return false;
};

export const getEmailError = (email: string): string => {
    if (!validateRequired(email)) {
        return 'Введите email';
    }
    if (!validateEmail(email)) {
        return 'Неверный формат email';
    }
    return '';
};

export const getPhoneError = (phone: string): string => {
    if (!validateRequired(phone)) {
        return 'Введите номер телефона';
    }
    if (!validatePhone(phone)) {
        return 'Неверный формат телефона';
    }
    return '';
};

export const getPasswordError = (password: string): string => {
    if (!validateRequired(password)) {
        return 'Введите пароль';
    }
    if (!validatePassword(password)) {
        return 'Пароль должен содержать минимум 6 символов и не более 100 символов';
    }
    return '';
};

export const getNameError = (name: string): string => {
    if (!validateRequired(name)) {
        return 'Введите ваше имя';
    }
    if (!validateName(name)) {
        return 'Имя должно содержать минимум 2 символа и не более 70';
    }
    return '';
};


export const getCategryName = (category: string): string => {
    if (!validateRequired(category)) {
        return 'Выберите категорию';
    }
    return '';
};

export const getTitleServiceError = (title: string): string => {
    if (!validateRequired(title)) {
        return 'Укажите название услуги';
    }
    if (title.trim().length < 3) {
        return 'Название должно содержать минимум 3 символа';
    }

    if (title.trim().length > 50) {
        return 'Название должно содержать не более 50 символов';
    }


    return '';
};


export const getPriceError = (price: number): string => {
    if (!validateRequired(price)) {
        return 'Укажите стоимость услуги';
    }
    if (price < 50) {
        return 'Цена должна превышать 50₽';
    }

    if (price > 100000) {
        return 'Цена не должна превышать 100 тыс.₽';
    }


    return '';
};

export const getDurationError = (duration: number): string => {
    if (!validateRequired(duration)) {
        return 'Укажите длительность услуги';
    }
    if (duration < 5) {
        return 'Длительность услуги должна превышать 5 минут';
    }

    if (duration > 240) {
        return 'Длительность услуги не должна превышать 240 минут';
    }


    return '';
};

export const validateAuthForm = (
    formData: {
        firstName: string;
        lastName: string;  // ← исправлено: было lasName
        email: string;
        phone: string;
        password: string;
    },
    mode: 'login' | 'register'
): ValidationErrors => {
    const errors: ValidationErrors = {
        firstName: '',
        lastName: '',    // ← исправлено: было lasName
        email: '',
        phone: '',
        password: ''
    };

    if (mode === 'register') {
        errors.firstName = getNameError(formData.firstName);
        errors.lastName = getNameError(formData.lastName);  // ← исправлено
        errors.phone = getPhoneError(formData.phone);
    }

    errors.email = getEmailError(formData.email);
    errors.password = getPasswordError(formData.password);

    return errors;
};
export const validateProfileForm = (formData: {
    name: string;
    email: string;
    phone: string;
}): ValidationErrors => {
    const errors: ValidationErrors = {
        name: '',
        email: '',
        phone: ''
    };

    errors.name = getNameError(formData.name);
    errors.email = getEmailError(formData.email);
    errors.phone = getPhoneError(formData.phone);

    return errors;
};


export const validateCreateServiceForm = (
    formData: {
        category_id: '',
        description: '',
        duration_minutes: '',
        is_auto_confirm: '',
        price: '',
        title: '',
    },
): ValidationErrors => {
    const errors: ValidationErrors = {
        category_id: '',
        description: '',
        duration_minutes: '',
        price: '',
        title: '',
    };

    errors.title = getTitleServiceError(formData.title);
    errors.description = getBioError(formData.description);
    errors.category_id = getCategryName(formData.category_id);
    errors.price = getPriceError(formData.price);
    errors.duration_minutes = getDurationError(formData.duration_minutes);

    return errors;
};



export const validateMasterAuthForm = (
    formData: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        city: '',
        description: '',
        avatar: '',
        category_id: ''
    },
): ValidationErrors => {
    const errors: ValidationErrors = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        city: '',
        description: '',
        avatar: '',
        category_id: ''
    };

    errors.firstName = getNameError(formData.firstName);
    errors.lastName = getNameError(formData.lastName);
    errors.phone = getPhoneError(formData.phone);
    errors.email = getEmailError(formData.email);
    errors.password = getPasswordError(formData.password);
    errors.address = getAddressError(formData.address);
    errors.city = getCityError(formData.city);
    errors.description = getBioError(formData.description);
    errors.avatar = getAvatarError(formData.avatar);
    errors.category_id = getCategryName(formData.category_id)
    return errors;
};



export const hasErrors = (errors: ValidationErrors): boolean => {
    return Object.values(errors).some(error => error !== '');
};
