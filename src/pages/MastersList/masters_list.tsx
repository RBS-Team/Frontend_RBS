import Menu from "../../components/menu/menu.tsx"
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {apiFetch} from "../../api/apiFetch";
import Services_list from "./master_list";
import YandexMapComponent, {Map} from "../../components/map/map";
// import {apiFetch} from "../../api/apiFetch.ts";

export default function MastersList(role : string) {
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
            <Menu role={role}/>
            <div className="masters-list-sections">
                <div className="right_section" id="masters-list-section">
                    <div className="masters-list__right_section__up">
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
                            Найдено {services.length} специалиста в пределах 1 км от вас:
                        </h2>
                        <Services_list services={services}/>
                    </div>
                </div>
                <div className="left-section">
                    <div className="maps-block">
                        <YandexMapComponent />
                    </div>
                </div>
            </div>
        </div>
    )
}