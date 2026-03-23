import Menu from "../../components/menu/menu.tsx"
import arrow from "../../static/imgs/arrow_right.svg";
import {useEffect, useState} from "react";
import {apiFetch} from "../../api/apiFetch.ts";

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
        <div className="collection___right_section">
            <div className="collection___right_section__up">
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
                    <div className="block__category_speactialist__all_blocks">
                        <div className="block__category_speactialist__block">
                            <div className="block__category__card_info">
                                <div className="block__category__card_info__main">
                                    <h1 className="category_speactialist__title">
                                        Маникюр
                                    </h1>
                                    <p className="category_speactialist__amount">
                                        Найдено 12+ тыс. специалистов
                                        неподалеку от вас
                                    </p>
                                </div>
                                <button className="block__search_speacialist__submit">
                                    <p>Подробнее</p>
                                    <img src={arrow} alt=""/>
                                </button>
                            </div>
                        </div>
                        <div className="block__category_speactialist__block">
                            <div className="block__category__card_info">
                                <div className="block__category__card_info__main">
                                    <h1 className="category_speactialist__title">
                                        Маникюр
                                    </h1>
                                    <p className="category_speactialist__amount">
                                        Найдено 12+ тыс. специалистов
                                        неподалеку от вас
                                    </p>
                                </div>
                                <button className="block__search_speacialist__submit">
                                    <p>Подробнее</p>
                                    <img src={arrow} alt=""/>
                                </button>
                            </div>
                        </div>
                        <div className="block__category_speactialist__block">
                            <div className="block__category__card_info">
                                <div className="block__category__card_info__main">
                                    <h1 className="category_speactialist__title">
                                        Маникюр
                                    </h1>
                                    <p className="category_speactialist__amount">
                                        Найдено 12+ тыс. специалистов
                                        неподалеку от вас
                                    </p>
                                </div>
                                <button className="block__search_speacialist__submit">
                                    <p>Подробнее</p>
                                    <img src={arrow} alt=""/>
                                </button>
                            </div>
                        </div>
                        <div className="block__category_speactialist__block">
                            <div className="block__category__card_info">
                                <div className="block__category__card_info__main">
                                    <h1 className="category_speactialist__title">
                                        Маникюр
                                    </h1>
                                    <p className="category_speactialist__amount">
                                        Найдено 12+ тыс. специалистов
                                        неподалеку от вас
                                    </p>
                                </div>
                                <button className="block__search_speacialist__submit">
                                    <p>Подробнее</p>
                                    <img src={arrow} alt=""/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}