import logo from "../../static/imgs/Logo.svg";
import profile_def from "../../static/imgs/profile_btn_def.svg";
import { useAuth } from "../../context/AuthContext";
import {Navigate, useNavigate} from "react-router-dom";

export default function Menu() {
    const { logout, user } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        <Navigate to="/login" replace />
    };

    const handleMain = () => {
        navigate("/");
    };

    const handleProfile = () => {
        navigate("/profile");
    }



    return (
        <div className="menu">
            <img src={logo} alt="logo" className="logo"/>
            <div className="menu__sections">
                <button className="section__btn" id="toMasters_collection__btn" onClick={handleMain}>
                    <p>Главная</p>
                </button>
                <button className="section__btn" id="toMasters_search__btn">
                    <p>Найти мастера</p>
                </button>
                <button className="section__btn" id="toCalendar__btn">
                    <p>Мои записи</p>
                </button>
                <button className="section__btn" id="toProfile__btn" onClick={handleProfile}>
                    <img src={profile_def} alt=""/>
                </button>
            </div>
        </div>
    );
}