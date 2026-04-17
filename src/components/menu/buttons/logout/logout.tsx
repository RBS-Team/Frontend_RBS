import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth.ts";
import calendar_def from "../../../../static/imgs/calendar_btn_def.svg";

export default function LogoutButton() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        console.log("Пользователь вышел, user:", user)
    };

    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);

    return <button className="section__btn" id="logout__btn" onClick={handleLogout}>
        <img src={calendar_def} alt=""/>
        <p>Выход</p>
    </button>;
}