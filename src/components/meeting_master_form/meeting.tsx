import {useForm} from "../../hooks/useForm";
import {
    handleServerError,
    mapServerErrorToValidation, type ServerError,
    validateCreateMaster
} from "../../validation/CheckAuth";
import {useDebounce} from "use-debounce";
import {useState} from "react";
import {apiFetch} from "../../api/apiFetch";

interface MeetingProps {
    role: string;
}

export default function MeetingMasterForm({ role }: MeetingProps) {
    const {values, handleChange, handleSubmit} = useForm(
        {name: "", bio: "", timezone: "Europe/Moscow"},
        validateCreateMaster
    );


    const [debouncedValues] = useDebounce(values, 300);
    const [errors, setErrors] = useState({name: "", bio: "", timezone: ""});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(() => {
        const alreadyShown = localStorage.getItem("meeting_wizard_shown");
        return alreadyShown !== "true";
    });

    const onSubmit = async (data: any) => {
        // const validationErrors = validateCreateMaster(values);
        // setErrors(validationErrors);
        //
        // if (Object.keys(validationErrors).length > 0) {
        //     return;
        // }

        try {
            const res = await apiFetch("/masters", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setIsVisible(false);
                localStorage.setItem("master_id", res.data.id);
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
                    setErrors(prev => ({...prev, ...mappedErrors}));
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
        }
    }

    const onClose = () => {
        setIsVisible(false);
        localStorage.setItem("meeting_wizard_shown", "true");
    };

    const isMasterMeeting = role === "master";
    if (!isMasterMeeting) return null;
        return (
            <>
                {isVisible && (
                    <div className="wizard-form-bg">
                        <div className="wizard-form-main-bg">
                            <form onSubmit={handleSubmit(onSubmit)} className="auth_login_form" id="meeting_form">
                                <h1 className="collect__login" id="meeting-title">
                                    Продолжим знакомство!
                                </h1>
                                {serverError && (
                                    <div className="server-error" style={{marginBottom: "15px"}}>
                                        <p className="showError" style={{color: "red", fontSize: "14px"}}>
                                            {serverError}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            id="text"
                                            name="name"
                                            placeholder=""
                                            className={errors.name ? "input-error" : ""}
                                            value={values.name}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="name" className={errors.name ? "label-error" : ""}>
                                            Введите свое ФИО
                                        </label>
                                    </div>
                                    {errors.name && <p className="showError">{errors.name}</p>}
                                </div>

                                <div>
                                    <div className="input-group">
                                        <div className="textarea-wrapper">
                                          <textarea
                                              id="bio"
                                              name="bio"
                                              value={values.bio}
                                              placeholder=" "
                                              className={errors.bio ? "textarea error" : "textarea"}
                                              onChange={handleChange}
                                          />
                                            <label htmlFor="bio">Расскажите о себе</label>
                                        </div>
                                    </div>
                                    {errors.bio && <p className="showError">{errors.bio}</p>}
                                </div>
                                <div className="bttns_form">
                                    <button className="grey_text_btn" type="button" onClick={onClose}>Заполню позже</button>
                                    <button className="auth__btn_submit" id="meeting-submit" type="submit" >Отправить</button>
                                </div>
                            </form>
                        </div>
                    </div>)}
                    </>);
}