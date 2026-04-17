import bg from "../../../../static/imgs/bg_masters_auth_right.jpg";
import star from "../../../../static/imgs/star_auth.svg";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../../api/apiFetch.ts";
import { Link, useNavigate } from "react-router-dom";
import {
    validateAuthOnSubmit,
    validateAuth,
    handleServerError,
    mapServerErrorToValidation,
    type ServerError
} from "../../../../validation/CheckAuth.ts";
import { useForm } from "../../../../hooks/useForm.ts";
import { useDebounce } from "use-debounce";

interface Props {
    onLogin: (user: any) => void;
}

export default function MastersRegistration({ onLogin }: Props) {
    const navigate = useNavigate();
    const { values, handleChange, handleSubmit } = useForm(
        { email: "", password: "", role: "master" },
        validateAuth
    );

    const [debouncedValues] = useDebounce(values, 300);
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [serverError, setServerError] = useState<string | null>(null);

    useEffect(() => {
        setErrors(validateAuth(debouncedValues));
        setServerError(null);
    }, [debouncedValues]);

    const onSubmit = async (data: any) => {
        const validationErrors = validateAuthOnSubmit(values);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            const res = await apiFetch("/client/register", {
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
            console.error("Registration error:", error);

            let serverErrorObj: ServerError;
            console.log(error);
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
                    message: 'Произошла ошибка при регистрации. Попробуйте позже.'
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
            <img src={bg} alt="bg" className="auth_left__image"/>
            <div className="auth_right__form">
                <div className="auth_right__form__block">
                    <div className="auth_right__form__block__inside">
                        <div className="auth_info">
                            <img src={star} alt="star" className="auth__info_star"/>
                            <h1 className="auth__header">
                                <span>С</span><span>Т</span><span>А</span><span>Н</span><span>Ь</span>
                                <span>&nbsp;</span>
                                <span>М</span><span>А</span><span>С</span><span>Т</span><span>Е</span><span>Р</span><span>О</span><span>М</span>
                            </h1>
                            <p className="auth__text">Мы соединяем тех, кто дарит красоту, и тех, кто её достоин. Присоединяйся!</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="auth_reg_form">
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
                                        placeholder=" "
                                        name="email"
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
                                        placeholder=" "
                                        className={errors.password ? "input-error" : ""}
                                        value={values.password}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="password" className={errors.password ? "label-error" : ""}>
                                        Придумайте пароль
                                    </label>
                                </div>
                                {errors.password && <p className="showError">{errors.password}</p>}
                            </div>

                            <div className="decorated-text">
                                <Link to="/login" className="goTo__link">
                                    <p className="pre_link__text">Уже есть аккаунт?</p> Войти
                                </Link>
                            </div>

                            <button className="auth__btn_submit" type="submit">
                                Создать аккаунт
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}