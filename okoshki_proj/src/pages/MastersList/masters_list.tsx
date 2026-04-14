import Menu from "../../components/menu/menu.tsx"
// import arrow from "../../static/imgs/arrow_right.svg";
import {useEffect, useState} from "react";
import arrow from "../../static/imgs/arrow_right.svg";
import avatar from "../../static/imgs/images.jpg"
import {useNavigate, useParams} from "react-router-dom";
import {apiFetch} from "../../api/apiFetch";
import Services_list from "./master_list";
// import {apiFetch} from "../../api/apiFetch.ts";

export default function MastersList() {
    const [services, setService] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        apiFetch(`/categories/${id}/services`)
            .then(res => {
                if (res.ok) {
                    setService(res.data);
                } else {
                    console.error(res);
                }
            })
            .catch(console.error);
    }, []);

    const onPrev = () => {
        navigate("/");
    }

    return (
        <div className="masters-list">
            <Menu/>
            <div className="right_section" id="masters-list-section">
                <div className="masters-list__right_section__up">
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
                    <Services_list services={services}/>
                </div>
            </div>
        </div>
    )
}