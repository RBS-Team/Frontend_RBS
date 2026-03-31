import Menu from "../../components/menu/menu.tsx"
import arrow from "../../static/imgs/arrow_right.svg";
import {useEffect, useState} from "react";
import {apiFetch} from "../../api/apiFetch.ts";
import Category_list from "./category_list.tsx";


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



    return (
    <div className="collections">
        <Menu/>
        <div className="right_section">
            <div className="right_section__up">
                <p className="collection_date">21 марта, пятница</p>
                <h1 className="collect__login">Привет, Гоша</h1>
            </div>
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
                <button className="block__search_speacialist__submit">
                    <p>Найти мастера</p>
                    <img src={arrow} alt=""/>
                </button>
            </div>
            <hr/>
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
    )
}