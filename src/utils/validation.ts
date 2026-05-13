export interface ValidationErrors {
    [key: string]: string;
}

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
};

export const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
};

export const validateRequired = (value: string): boolean => {
    return value.trim().length > 0;
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
        return 'Пароль должен содержать минимум 6 символов';
    }
    return '';
};

export const getNameError = (name: string): string => {
    if (!validateRequired(name)) {
        return 'Введите ваше имя';
    }
    if (!validateName(name)) {
        return 'Имя должно содержать минимум 2 символа';
    }
    return '';
};

export const validateAuthForm = (
    formData: {
        name: string;
        email: string;
        phone: string;
        password: string;
    },
    mode: 'login' | 'register'
): ValidationErrors => {
    const errors: ValidationErrors = {
        name: '',
        email: '',
        phone: '',
        password: ''
    };

    if (mode === 'register') {
        errors.name = getNameError(formData.name);
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

export const hasErrors = (errors: ValidationErrors): boolean => {
    return Object.values(errors).some(error => error !== '');
};
