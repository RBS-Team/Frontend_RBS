import arrow from "../../static/imgs/arrow_right.svg";
import {useNavigate} from "react-router-dom";



export default function Category_list({categories}) {
    const navigate = useNavigate();

    const onPress = () => {
        navigate("/categories/id");
    }
    return (
        <div className="block__category_speactialist__all_blocks">
        {categories.slice(0, 4).map((category) => (
                <div className="block__category_speactialist__block" key={category.id}>
                    <div className="block__category__card_info">
                        <div className="block__category__card_info__main">
                            <h1 className="category_speactialist__title">
                                {category.name}
                            </h1>
                            <p className="category_speactialist__amount">
                                Найдено 12+ тыс. специалистов
                                неподалеку от вас [Замокано]
                            </p>
                        </div>
                        <button className="block__search_speacialist__submit" onClick={onPress}>
                            <p>Подробнее</p>
                            <img src={arrow} alt=""/>
                        </button>
                    </div>
                </div>))}
        </div>);
};

