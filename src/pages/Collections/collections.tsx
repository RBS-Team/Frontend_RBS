import Menu from "../../components/menu/menu.tsx"
import arrow from "../../static/imgs/arrow_right.svg";
import {useEffect, useState} from "react";
import {apiFetch} from "../../api/apiFetch.ts";
import Category_list from "./category_list.tsx";
import MeetingMasterForm from "../../components/meeting_master_form/meeting";

export default function Collections() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        apiFetch("/categories")
            .then(res => {
                if (res.ok) {
                    setCategories(res.data);
                } else {
                    console.error(res);
                }
            })
            .catch(console.error);
    }, []);

    const user = localStorage.getItem("user");
    const roleName = JSON.parse(user).role;




    return (
        <div className="screen">
            <div className="collections">
                <Menu/>
                <div className="right_section">
                    <div className="block__search_speacialist">
                        <div className="block__search_speacialist__info">
                            <h1 className="block__search_specialist__title">
                                Мечты сбываются здесь
                            </h1>
                            <p className="block__search_specialist__text">
                                Подберем мастера, который сделает лучше,
                                чем на картинке.
                            </p>
                        </div>
                        <button className="block__search_speacialist__submit" id="black-add">
                            <p>Найти мастера</p>
                            <img src={arrow} alt=""/>
                        </button>
                    </div>
                    <div className="block__category_speactialist">
                        <div className="block__category_inside">
                            <h2 className="block__category_speactialist__title">
                                Подборки лучших специалистов в твоем городе
                            </h2>
                            <Category_list categories={categories} />
                        </div>
                    </div>
                </div>
            </div>
        <MeetingMasterForm role={roleName}/>
        </div>
    )
}