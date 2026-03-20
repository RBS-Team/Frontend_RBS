import logo from "../../static/imgs/Logo.svg";
import coll_def from "../../static/imgs/collections_btn_default.svg";
import search_def from "../../static/imgs/search_btn_def.svg";
import profile_def from "../../static/imgs/profile_btn_def.svg";
import calendar_def from "../../static/imgs/calendar_btn_def.svg";

export default function Menu() {
    return (
        <div className="menu">
            <img src={logo} alt="logo" className="logo"/>
            <div className="menu__sections">
                <button className="section__btn" id="toMasters_collection__btn">
                    <img src={coll_def} alt=""/>
                <p>Витрина мастеров</p>
                </button>
                <button className="section__btn" id="toMasters_search__btn">
                    <img src={search_def} alt=""/>
                    <p>Найти мастера</p>
                </button>
                <button className="section__btn" id="toProfile__btn">
                    <img src={profile_def} alt=""/>
                    <p>Профиль</p>
                </button>
                    <button className="section__btn" id="toCalendar__btn">
                    <img src={calendar_def} alt=""/>
                    <p>Ваши записи</p>
                </button>
            </div>
        </div>
    )
}