import Menu from "../../../components/menu/menu.tsx"
import avatar_test from "../../../static/imgs/avatar_test.svg"


export default function MasterProfile() {

    return (
        <div className="screen">
            <div className="profile_master">
                <Menu/>
                <div className="right_section" id="profile-page">
                    <h1 className="collect__login" id="h1__color_blue">Ваш профиль</h1>
                    <div className="profile-sections">
                        <div className="up_profile_block">
                            <img src={avatar_test} alt="" className="Avatar_profile" />
                            <div className="up-sections">
                                <div className="AboutMe">
                                    <div className="AboutMe__info">
                                        <h3 id="h3__color_blue">Арсений Игорев</h3>
                                        <p className="TitleRole">Мастер</p>
                                        <hr className="hr-profile-vertical" />
                                        <div className="about-me-block">
                                            <p className="About-me-text">
                                                <span className="About-me-label">О себе:</span> Lorem ipsum dolor sit amet et aute laborum laborum enim aute. Laboris in ut ullamco sint do. Mollit ut anim ullamco ut deserunt nostrud amet sint consectetur labore in veniam commodo. Esse aliqua amet veniam labore deserunt nulla ea ipsum.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="Abilities">
                                    <p className="Abilities-shablon"> Навыки: </p>
                                    <hr className="horizont-hr" />
                                    <div className="Abilities-tags">Этот контент временно недоступен</div>
                                </div>
                            </div>
                        </div>
                        <div className="down-section">
                            <div className="profile-down-left-section">
                                <div className="UrEducation">
                                    <h3 id="h3__color_blue">Образование</h3>
                                    <hr className="hr-profile-vertical" />
                                    <div className="ItsEnough">Этот контент временно недоступен</div>
                                </div>
                                <div className="UrContacts">
                                    <h3 id="h3__color_blue">Контакты</h3>
                                    <hr className="hr-profile-vertical" />
                                    <div className="ItsEnough">Этот контент временно недоступен</div>
                                </div>
                            </div>
                            <div className="profile-down-right-section">
                                <div className="UrServices">
                                    <h3 id="h3__color_blue">Ваши услуги</h3>
                                    <hr className="hr-profile-vertical" />
                                    <div className="ItsEnough">Этот контент временно недоступен</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}