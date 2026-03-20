export interface AuthData {
    email: string;
    password: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// export function validateLogin(data: AuthData) {
//     const errors: Partial<AuthData> = {};
//
//     if (!emailRegex.test(data.email)) {
//         errors.email = "Некорректный email";
//     }
//
//     if (data.password) {
//         errors.password = "Введите пароль";
//     }
//
//     return errors;
// }



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
            errors.password = "Пароль должен содержат минимум 6 символов";
        } else if (data.password === data.password.toLowerCase()) {
            errors.password = "Пароль должен содержать минимум 1 заглавных символ";
        } else if (data.password.length > 200) {
            errors.password = "Пароль должен содержать не более 200 символов";
        }
    }



    return errors;
}