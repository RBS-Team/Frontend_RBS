import Menu from "../../components/menu/menu.tsx"
// import arrow from "../../static/imgs/arrow_right.svg";
import {useEffect, useState} from "react";
import arrow from "../../static/imgs/arrow_right.svg";
import avatar from "../../static/imgs/images.jpg"
import {useNavigate} from "react-router-dom";
// import {apiFetch} from "../../api/apiFetch.ts";

export default function MastersList() {
    const [masters, setMasters] = useState([]);
    const navigate = useNavigate();
    // useEffect(() => {
    //     apiFetch("/categories/")
    //         .then(res => {
    //             if (res.ok) {
    //                 setMasters(res.data);
    //             } else {
    //                 console.error(res);
    //             }
    //         })
    //         .catch(console.error);
    // }, []);

    const onPrev = () => {
        navigate("/");
    }

    return (
        <div className="masters-list">
            <Menu/>
            <div className="right_section">
                <div className="masters-list__right_section__up">
                    <button className="preview-btn" onClick={onPrev}> &#60; </button>
                    <h1 className="collect__login" id="h1__color_blue">Результаты поиска</h1>
                    <div className="filters">
                        <div className="filter-block">
                            <p className="filter__title">Маникюр</p>
                        </div>
                        <div className="filter-block">
                            <p className="filter__title">Маникюр</p>
                        </div>
                        <div className="filter-block">
                            <p className="filter__title">Маникюр</p>
                        </div>
                    </div>
                </div>

                <div className="master-list__main_section">
                    <h2 className="collection_date" id="h2__color_blue">
                        Найдено 1043 специалиста в пределах 1 км от вас:
                    </h2>
                    <div className="masters-list__scroll">
                        <div className="masters-list__block">
                            <div className="masters-list__block_data">
                                <div className="masters-list__block_data_info">
                                    <img className="master-avatar" src={avatar} alt=""/>
                                    <div className="master-list__block_data_info_text">
                                        <h3 className="h3__color_blue">
                                            Арсений Игорев
                                        </h3>
                                        <p className="master__job">
                                            Мастер маникюра
                                        </p>
                                        <div className="master_tag__list">
                                            <div className="master_tag">
                                                Маникюр
                                            </div>
                                            <div className="master_tag">
                                                Педикюр
                                            </div>
                                            <div className="master_tag">
                                                Ресницы
                                            </div>
                                            <div className="master_tag">
                                                Ресницы
                                            </div>

                                        </div>
                                        <h4 className="master__rate">
                                            Рейтинг: 4.94
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="master-block__right_section">
                                <div className="master__price">
                                    4 532 ₽
                                </div>
                                <button className="block__search_speacialist__submit" id="master_block_next" >
                                    <p>Подробнее</p>
                                    <img src={arrow} alt=""/>
                                </button>
                            </div>
                        </div>
                        <div className="masters-list__block">
                            <div className="masters-list__block_data">
                                <div className="masters-list__block_data_info">
                                    <img className="master-avatar" src={avatar} alt=""/>
                                    <div className="master-list__block_data_info_text">
                                        <h3 className="h3__color_blue">
                                            Арсений Игорев
                                        </h3>
                                        <p className="master__job">
                                            Мастер маникюра
                                        </p>
                                        <div className="master_tag__list">
                                            <div className="master_tag">
                                                Маникюр
                                            </div>
                                            <div className="master_tag">
                                                Педикюр
                                            </div>
                                            <div className="master_tag">
                                                Ресницы
                                            </div>
                                            <div className="master_tag">
                                                Ресницы
                                            </div>

                                        </div>
                                        <h4 className="master__rate">
                                            Рейтинг: 4.94
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="master-block__right_section">
                                <div className="master__price">
                                    4 532 ₽
                                </div>
                                <button className="block__search_speacialist__submit" id="master_block_next">
                                    <p>Подробнее</p>
                                </button>
                            </div>
                        </div>
                        <div className="masters-list__block">
                            <div className="masters-list__block_data">
                                <div className="masters-list__block_data_info">
                                    <img className="master-avatar" src={avatar} alt=""/>
                                    <div className="master-list__block_data_info_text">
                                        <h3 className="h3__color_blue">
                                            Арсений Игорев
                                        </h3>
                                        <p className="master__job">
                                            Мастер маникюра
                                        </p>
                                        <div className="master_tag__list">
                                            <div className="master_tag">
                                                Маникюр
                                            </div>
                                            <div className="master_tag">
                                                Педикюр
                                            </div>
                                            <div className="master_tag">
                                                Ресницы
                                            </div>
                                            <div className="master_tag">
                                                Ресницы
                                            </div>
                                        </div>
                                        <h4 className="master__rate">
                                            Рейтинг: 4.94
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="master-block__right_section">
                                <div className="master__price">
                                    4 532 ₽
                                </div>
                                <button className="block__search_speacialist__submit" id="master_block_next">
                                    <p>Подробнее</p>
                                    <img src={arrow} alt=""/>
                                </button>
                            </div>
                        </div>
                        <div className="masters-list__block">
                            <div className="masters-list__block_data">
                                <div className="masters-list__block_data_info">
                                    <img className="master-avatar" src={avatar} alt=""/>
                                    <div className="master-list__block_data_info_text">
                                        <h3 className="h3__color_blue">
                                            Арсений Игорев
                                        </h3>
                                        <p className="master__job">
                                            Мастер маникюра
                                        </p>
                                        <div className="master_tag__list">
                                            <div className="master_tag">
                                                Маникюр
                                            </div>
                                            <div className="master_tag">
                                                Педикюр
                                            </div>
                                            <div className="master_tag">
                                                Ресницы
                                            </div>
                                            <div className="master_tag">
                                                Ресницы
                                            </div>

                                        </div>
                                        <h4 className="master__rate">
                                            Рейтинг: 4.94
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="master-block__right_section">
                                <div className="master__price">
                                    4 532 ₽
                                </div>
                                <button className="block__search_speacialist__submit" id="master_block_next">
                                    <p>Подробнее</p>
                                    <img src={arrow} alt=""/>
                                </button>
                            </div>
                        </div>
                        <div className="masters-list__block">
                            <div className="masters-list__block_data">
                                <div className="masters-list__block_data_info">
                                    <img className="master-avatar" src={avatar} alt=""/>
                                    <div className="master-list__block_data_info_text">
                                        <h3 className="h3__color_blue">
                                            Арсений Игорев
                                        </h3>
                                        <p className="master__job">
                                            Мастер маникюра
                                        </p>
                                        <div className="master_tag__list">
                                            <div className="master_tag">
                                                Маникюр
                                            </div>
                                            <div className="master_tag">
                                                Педикюр
                                            </div>
                                            <div className="master_tag">
                                                Ресницы
                                            </div>
                                            <div className="master_tag">
                                                Ресницы
                                            </div>

                                        </div>
                                        <h4 className="master__rate">
                                            Рейтинг: 4.94
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="master-block__right_section">
                                <div className="master__price">
                                    4 532 ₽
                                </div>
                                <button className="block__search_speacialist__submit" id="master_block_next">
                                    <p>Подробнее</p>
                                    <img src={arrow} alt=""/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}