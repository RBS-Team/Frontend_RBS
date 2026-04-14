import bg from "../../../static/imgs/Login_background.svg";
import star from "../../../static/imgs/star_auth.svg";
import { apiFetch } from "../../../api/apiFetch";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../../hooks/useForm.ts";
import {
    validateAuth,
    validateAuthOnSubmit,
    handleServerError,
    mapServerErrorToValidation,
    type ServerError
} from "../../../validation/CheckAuth.ts";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";

interface LoginProps {
    onLogin: (user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const { values, handleChange, handleSubmit } = useForm(
        { email: "", password: "" },
        validateAuth
    );

    const [debouncedValues] = useDebounce(values, 300);
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [serverError, setServerError] = useState<string | null>(null);

    useEffect(() => {
        setErrors(validateAuth(debouncedValues));
        setServerError(null);
    }, [debouncedValues]);

    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        const validationErrors = validateAuthOnSubmit(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            const res = await apiFetch("/client/login", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (res.ok) {
                onLogin({ id: res.data.id, role: res.data.role });
                navigate("/");
            } else {
                const errorForHandler = {
                    response: {
                        status: res.status,
                        data: res.data
                    }
                };

                const serverErrorObj = handleServerError(errorForHandler);
                const mappedErrors = mapServerErrorToValidation(serverErrorObj);
                if (Object.keys(mappedErrors).length > 0) {
                    setErrors(prev => ({ ...prev, ...mappedErrors }));
                } else {
                    setServerError(serverErrorObj.message);
                }
            }
        } catch (error: any) {

            let serverErrorObj: ServerError;
            if (error.response) {
                serverErrorObj = handleServerError(error);
            } else if (error.request) {
                serverErrorObj = {
                    type: 'server_error',
                    message: 'Нет соединения с сервером. Проверьте интернет-соединение'
                };
            } else {
                serverErrorObj = {
                    type: 'server_error',
                    message: 'Произошла ошибка при входе. Попробуйте позже.'
                };
            }

            const mappedErrors = mapServerErrorToValidation(serverErrorObj);

            if (Object.keys(mappedErrors).length > 0) {
                setErrors(prev => ({ ...prev, ...mappedErrors }));
            } else {
                setServerError(serverErrorObj.message);
            }
        }
    };

    return (
        <div className="auth__page">
            <div className="auth_right__form">
                <div className="auth_right__form__block">
                    <div className="auth_right__form__block__inside">
                        <div className="auth_info">
                            <img src={star} alt="star" className="auth__info_star" />
                            <h1 className="auth__header">
                                Логин
                            </h1>
                            <p className="auth__text">
                                Серьёзно. Прямо сейчас кто-то мечтает о вашем макияже <br />
                                (или ищет мастера, который наконец-то сделает те самые брови).<br />
                                Не томите — заходите, пока мечты не сбылись без вас!
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="auth_login_form">
                            {serverError && (
                                <div className="server-error" style={{ marginBottom: "15px" }}>
                                    <p className="showError" style={{ color: "red", fontSize: "14px" }}>
                                        {serverError}
                                    </p>
                                </div>
                            )}

                            <div>
                                <div className="input-group">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder=" "
                                        className={errors.email ? "input-error" : ""}
                                        value={values.email}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="email" className={errors.email ? "label-error" : ""}>
                                        Введите e-mail
                                    </label>
                                </div>
                                {errors.email && <p className="showError">{errors.email}</p>}
                            </div>

                            <div>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        placeholder=" "
                                        className={errors.password ? "input-error" : ""}
                                    />
                                    <label htmlFor="password" className={errors.password ? "label-error" : ""}>
                                        Введите пароль
                                    </label>
                                </div>
                                {errors.password && <p className="showError">{errors.password}</p>}
                            </div>

                            <div className="decorated-text">
                                <Link to="/registration" className="goTo__link">
                                    Создайте аккаунт
                                </Link>
                            </div>

                            <button className="auth__btn_submit" type="submit">
                                Войти
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <img src={bg} alt="bg" className="auth_left__image" />
        </div>
    );
}