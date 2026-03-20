import bg from "../../../static/imgs/Registration_background.svg";
import star from "../../../static/imgs/star_auth.svg";
import {useEffect, useState} from "react";
import { apiFetch } from "../../../api/apiFetch.ts";
import {useNavigate} from "react-router-dom";
import {validateAuthOnSubmit, validateAuth} from "../../../validation/CheckAuth.ts";
import {useForm} from "../../../hooks/useForm.ts";
import { useDebounce } from "use-debounce";

interface Props {
    onLogin: (user: any) => void;
}

export default function Registration({ onLogin }: Props) {
    const navigate = useNavigate();
    const { values, handleChange, handleSubmit } = useForm(
        { email: "", password: "" },
        validateAuth
    );

    const [debouncedValues] = useDebounce(values, 300);
    const [errors, setErrors] = useState({ email: "", password: "" });

    useEffect(() => {
        setErrors(validateAuth(debouncedValues));
    }, [debouncedValues]);

    const onSubmit = async (data: any) => {
        const validationErrors = validateAuthOnSubmit(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;
        const res = await apiFetch("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        });

        if (res.ok) {
            onLogin(res.data.user);
            navigate("/");
        }
    };
    return <div className="auth__page">
        <img src={bg} alt="bg" className="auth_left__image"/>
        <div className="auth_right__form">
            <div className="auth_right__form__block" >
                <div className="auth_right__form__block__inside">
                    <div className="auth_info">
                        <img src={star} alt="star" className="auth__info_star"/>
                        <h1 className="auth__header">
                            <span>С</span><span>о</span><span>з</span><span>д</span><span>а</span><span>т</span><span>ь</span>
                            <span>&nbsp;</span>
                            <span>а</span><span>к</span><span>к</span><span>а</span><span>у</span><span>н</span><span>т</span>
                        </h1>
                        <p className="auth__text">Мы соединяем тех, кто дарит красоту, и тех, кто её достоин.
                            Присоединяйся!</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="auth_reg_form">
                        <div>
                            <div className="input-group">
                                <input type="email" id="email" placeholder=" " name="email" className={errors.email ? "input-error" : ""} value={values.email}
                                       onChange={handleChange}/>
                                <label htmlFor="email" className={errors.email ? "label-error" : ""}>Введите e-mail</label>
                            </div>
                            {errors.email && <p className="showError">{errors.email}</p>}
                        </div>

                        <div>
                            <div className="input-group">
                                <input type="password" id="password" name="password" placeholder=" " className={errors.password ? "input-error" : ""}  value={values.password}
                                       onChange={handleChange}/>
                                <label htmlFor="password" className={errors.password ? "label-error" : ""}>Придумайте пароль</label>
                            </div>
                            {errors.password && <p className="showError">{errors.password}</p>}
                        </div>
                        <button className="auth__btn_submit" type="submit">
                            Создать аккаунт
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>;
}