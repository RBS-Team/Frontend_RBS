import arrow from "../../static/imgs/arrow_right.svg";
import {useNavigate} from "react-router-dom";
import avatar from "../../static/imgs/images.jpg";



export default function Services_list({services}) {
    // const navigate = useNavigate();

    return (
        <div className="masters-list__scroll">
            {services.map((service : object) => (
                    <div className="masters-list__block" key={service.id}>
                        <div className="masters-list__block_data">
                            <div className="masters-list__block_data_info">
                                <img className="master-avatar" src={avatar} alt=""/>
                                <div className="master-list__block_data_info_text">
                                    <h3 className="h3__color_blue">
                                        {service.master.name}
                                    </h3>
                                    <p className="master__job">
                                        {service.title}
                                    </p>
                                    <p className="master__job">
                                        О себе: {service.master.bio}
                                    </p>
                                    <h4 className="master__rate">
                                        Рейтинг:  <p className="p__color_blue"> {service.master.rating}</p>
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="master-block__right_section">
                            <div className="master__price">
                                {service.price} ₽
                            </div>
                            <button className="block__search_speacialist__submit" id="master_block_next" >
                                <p>Подробнее</p>
                                <img src={arrow} alt=""/>
                            </button>
                        </div>
                </div>))}
        </div>);
};

