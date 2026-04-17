export interface AuthData {
    email: string;
    password: string;
    role: string;
}

export interface MasterData{
    name: string;
    bio: string;
    timezone: string;
}

export interface ServerError {
    type: 'invalid_credentials' | 'user_not_found' | 'email_not_confirmed' | 'too_many_attempts' | 'server_error' | 'resource_conflict';
    message: string;
    field?: 'email' | 'password';
}

const emailRegex = /^[-a-z0-9!#$%&'*+/=?^_{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_{|}~]+)*@(?:[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*(?:aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])$/;

export function validateAuthOnSubmit(data: AuthData) {
    const errors: Partial<AuthData> = {};

    if (!data.email) {
        errors.email = "Введите email";
    }
    if (!data.password) {
        errors.password = "Введите пароль";
    }

    return errors;
}

export function validateAuth(data: AuthData) {
    const errors: Partial<AuthData> = {};

    if (!emailRegex.test(data.email) && data.email.length >= 1) {
        errors.email = "Некорректный email";
    }
    if (data.password) {
        if (data.password.length < 6) {
            errors.password = "Пароль должен содержать минимум 6 символов";
        } else if (data.password === data.password.toLowerCase()) {
            errors.password = "Пароль должен содержать минимум 1 заглавную букву";
        } else if (data.password.length > 200) {
            errors.password = "Пароль должен содержать не более 200 символов";
        }
    }

    return errors;
}


export function validateCreateMaster(data: MasterData) {
    const errors: Partial<MasterData> = {};

    if (data.userName) {
        if (data.userName.length > 200) {
            errors.userName = "Имя должно содержать менее 200 символов";
        }

        if (data.userName.length <= 1) {
            errors.userName = "Имя должно более 1 символа";
        }
    }

    return errors;
}

export function handleServerError(error: any): ServerError {
    const defaultError: ServerError = {
        type: 'server_error',
        message: 'Произошла ошибка на сервере. Попробуйте позже.'
    };
    if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        console.log(error.status);

        switch (status) {
            case 401:
                return {
                    type: 'invalid_credentials',
                    message: 'Неверный email или пароль',
                    field: 'password'
                };

            case 404:
                return {
                    type: 'user_not_found',
                    message: 'Пользователь с таким email не найден',
                    field: 'email'
                };
            case 409:
                    return {
                        type: 'resource_conflict',
                        message: 'Этот email уже занят',
                        field: 'email'
                    };

            case 429:
                return {
                    type: 'too_many_attempts',
                    message: 'Слишком много попыток входа. Попробуйте через 15 минут',
                    field: 'email'
                };

            default:
                if (data?.message) {
                    return {
                        type: 'server_error',
                        message: data.message
                    };
                }
                return defaultError;
        }
    }

    if (error.request && !error.response) {
        return {
            type: 'server_error',
            message: 'Нет соединения с сервером. Проверьте интернет-соединение'
        };
    }

    return defaultError;
}

export function mapServerErrorToValidation(error: ServerError): Partial<AuthData> {
    const errors: Partial<AuthData> = {};

    if (error.field === 'email') {
        errors.email = error.message;
    } else if (error.field === 'password') {
        errors.password = error.message;
    }

    return errors;
}