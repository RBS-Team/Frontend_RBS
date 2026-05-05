import { useState, useEffect } from 'react';
import { Menu } from '../../components/menu/menu.tsx';
import { HeroSection } from '../../components/HeroSection/HeroSection';
import { CategoryCard } from '../../components/CategoryCard/CategoryCard';
import { MasterCard } from '../../components/MasterCard/MasterCard';
import { BookingModal } from '../../components/BookingModal/BookingModal';
import { HowItWorks } from '../../components/HowItWorks/HowItWorks';
import { TestimonialCard } from '../../components/TestimonialCard/TestimonialCard';
import { PopularCities } from '../../components/PopularCitites/PopularCities';
import { CallToAction } from '../../components/CallToAction/CallToAction';
import { Onboarding } from '../../components/OnBoarding/OnBoarding';
import {AuthModal} from "../../components/AuthModal/AuthModal";
import { Scissors, Sparkles, Heart, Clock } from 'lucide-react';
import {useNavigate} from "react-router-dom";
import {UserProfile} from "../../components/client/UserProfile";
import {apiFetch} from "../../api/apiFetch";


interface User {
    id: string;
    email: string;
}

export default function collections() {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [showUserProfile, setShowUserProfile] = useState(false);

    const [categories, setCategories] = useState([]);

    const user_s = localStorage.getItem('user');
    const navigate = useNavigate();
    console.log(user_s);
    const [selectedMaster, setSelectedMaster] = useState<{
        name: string;
        specialty: string;
        imageUrl: string;
        portfolio: string[];
        rating: number;
        reviews: number;
    } | null>(null);


    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        if (!hasSeenOnboarding) {
            setShowOnboarding(true);
        }


        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleOnboardingComplete = () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        setShowOnboarding(false);
    };

    const onCategoryClick = (id) =>{
        navigate("/category/" + id);
    }

    const handleAuthSuccess = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setShowAuthModal(false);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // const handleBookClick = (master: typeof selectedMaster) => {
    //     if (!user) {
    //         setShowAuthModal(true);
    //     } else {
    //         setSelectedMaster(master);
    //     }
    // };


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


    console.log(categories);




    const handleUpdateUser = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };


    if (showOnboarding) {
        return <Onboarding onComplete={handleOnboardingComplete} />;
    }


    // const categories = [
    //     {
    //         title: 'Парикмахерские услуги',
    //         imageUrl: 'https://images.unsplash.com/photo-1763048208932-cbe149724374?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         count: 3420
    //     },
    //     {
    //         title: 'Маникюр и педикюр',
    //         imageUrl: 'https://images.unsplash.com/photo-1676926606566-58f2e00b592b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         count: 2890
    //     },
    //     {
    //         title: 'Макияж',
    //         imageUrl: 'https://images.unsplash.com/photo-1698181842119-a5283dea1440?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         count: 1560
    //     },
    //     {
    //         title: 'Косметология',
    //         imageUrl: 'https://images.unsplash.com/photo-1619367901998-73b3a70b3898?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         count: 1240
    //     },
    //     {
    //         title: 'Косметология',
    //         imageUrl: 'https://images.unsplash.com/photo-1619367901998-73b3a70b3898?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         count: 1240
    //     },
    //     {
    //         title: 'Косметология',
    //         imageUrl: 'https://images.unsplash.com/photo-1619367901998-73b3a70b3898?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         count: 1240
    //     },
    //     {
    //         title: 'Косметология',
    //         imageUrl: 'https://images.unsplash.com/photo-1619367901998-73b3a70b3898?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         count: 1240
    //     },
    //     {
    //         title: 'Косметология',
    //         imageUrl: 'https://images.unsplash.com/photo-1619367901998-73b3a70b3898?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         count: 1240
    //     },
    // ];

    // const masters = [
    //     {
    //         name: 'Анна Петрова',
    //         specialty: 'Стилист-колорист',
    //         imageUrl: 'https://images.unsplash.com/photo-1761839256791-6a93f89fb8b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         rating: 4.9,
    //         reviews: 156,
    //         location: 'Москва, Центр',
    //         priceFrom: 3500,
    //         isVerified: true,
    //         portfolio: [
    //             'https://images.unsplash.com/photo-1638064432601-18b99cb31acb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1605980625458-21e4d9c29c4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1630695239920-4b5bb84a7c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1574773004910-1eeaabb62b55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1605980625969-513c0d1f0c8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1554519880-ffe46861d570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1682450239611-e2c845970926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1658322558683-2524c9b62d04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    //         ]
    //     },
    //     {
    //         name: 'Мария Соколова',
    //         specialty: 'Мастер маникюра',
    //         imageUrl: 'https://images.unsplash.com/photo-1753285311550-154917dab783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         rating: 4.8,
    //         reviews: 203,
    //         location: 'Санкт-Петербург',
    //         priceFrom: 2000,
    //         isVerified: true,
    //         portfolio: [
    //             'https://images.unsplash.com/photo-1676926606566-58f2e00b592b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1690749138086-7422f71dc159?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1753285311550-154917dab783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1737326376593-0eb74bff094e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1663229050022-ac26de6f05d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1605980625458-21e4d9c29c4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    //         ]
    //     },
    //     {
    //         name: 'Елена Волкова',
    //         specialty: 'Визажист',
    //         imageUrl: 'https://images.unsplash.com/photo-1653130029149-9109b115ab9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         rating: 5.0,
    //         reviews: 89,
    //         location: 'Москва, Арбат',
    //         priceFrom: 4500,
    //         isVerified: true,
    //         portfolio: [
    //             'https://images.unsplash.com/photo-1698181842119-a5283dea1440?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1723150512429-bfa92988d845?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1698181842513-2179d5f8bc65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1585261941042-5da0c5f1f0a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1653130029149-9109b115ab9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1574773004910-1eeaabb62b55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    //         ]
    //     },
    //     {
    //         name: 'Дмитрий Морозов',
    //         specialty: 'Барбер',
    //         imageUrl: 'https://images.unsplash.com/photo-1761931403671-d020a14928d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //         rating: 4.9,
    //         reviews: 178,
    //         location: 'Москва, Сокол',
    //         priceFrom: 2500,
    //         isVerified: true,
    //         portfolio: [
    //             'https://images.unsplash.com/photo-1761931403671-d020a14928d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1759142016096-a9d1a5ebcc09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1763048208932-cbe149724374?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1675034741473-afed58a142e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1707720531504-ce087725861a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    //             'https://images.unsplash.com/photo-1647462741351-4e7a5e7317c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    //         ]
    //     }
    // ];



    const features = [
        {
            icon: Scissors,
            title: 'Проверенные мастера',
            description: 'Все специалисты проходят тщательную проверку и имеют сертификаты'
        },
        {
            icon: Clock,
            title: 'Онлайн-запись 24/7',
            description: 'Бронируйте удобное время в любой момент через приложение'
        },
        {
            icon: Heart,
            title: 'Гарантия качества',
            description: 'Возврат средств, если результат вас не устроит'
        },
        {
            icon: Sparkles,
            title: 'Лучшие цены',
            description: 'Прямые цены от мастеров без наценок'
        }
    ];

    const testimonials = [
        {
            name: 'Анастасия Романова',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            rating: 5,
            text: 'Великолепная работа! Мастер не только создала потрясающую укладку, но и дала полезные советы по уходу за волосами. Обязательно вернусь снова!',
            service: 'Окрашивание и укладка',
            masterName: 'Анна Петрова'
        },
        {
            name: 'Екатерина Смирнова',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            rating: 5,
            text: 'Маникюр просто восхитительный! Мастер очень внимательная и профессиональная. Работа выполнена безупречно, держится уже 3 недели.',
            service: 'Маникюр с покрытием',
            masterName: 'Мария Соколова'
        },
        {
            name: 'Ольга Воронцова',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
            rating: 5,
            text: 'Свадебный макияж был идеален! Держался весь день, на фото получилось потрясающе. Спасибо за профессионализм!',
            service: 'Свадебный макияж',
            masterName: 'Елена Волкова'
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Menu
                user={user}
                onLogout={handleLogout}
                onLoginClick={() => setShowAuthModal(true)}
                onProfileClick={() => setShowUserProfile(true)}
            />
            <HeroSection />

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-center mb-10">Популярные категории</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <CategoryCard key={category.id} {...category} onClickCategory={() =>{onCategoryClick(category.id)}} />
                        )).slice(0,8)}
                    </div>
                </div>
            </section>


            <HowItWorks />

            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="mb-4">Отзывы наших клиентов</h2>
                        <p className="text-gray-600">Более 10 000 довольных клиентов по всей России</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard key={index} {...testimonial} />
                        ))}
                    </div>
                </div>
            </section>

            <PopularCities />

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-center mb-12">Почему выбирают нас</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center">
                                    <feature.icon className="text-pink-600" size={32} />
                                </div>
                                <h3 className="mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CallToAction />

            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg"></div>
                                <span className="text-xl">Okoshki</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Ваш путь к красоте начинается здесь
                            </p>
                        </div>

                        <div>
                            <h4 className="mb-4">Для клиентов</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white">Найти мастера</a></li>
                                <li><a href="#" className="hover:text-white">Категории услуг</a></li>
                                <li><a href="#" className="hover:text-white">Отзывы</a></li>
                                <li>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('hasSeenOnboarding');
                                            setShowOnboarding(true);
                                        }}
                                        className="hover:text-white text-left transition-colors"
                                    >
                                        🎯 Как это работает
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-4">Для специалистов</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white">Стать мастером</a></li>
                                <li><a href="#" className="hover:text-white">Тарифы</a></li>
                                <li><a href="#" className="hover:text-white">Поддержка</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-4">Компания</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white">О нас</a></li>
                                <li><a href="#" className="hover:text-white">Контакты</a></li>
                                <li><a href="#" className="hover:text-white">Вакансии</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
                        <p>© 2026 Okoshki. Все права защищены.</p>
                    </div>
                </div>
            </footer>

            {selectedMaster && (
                <BookingModal
                    masterName={selectedMaster.name}
                    masterImage={selectedMaster.imageUrl}
                    specialty={selectedMaster.specialty}
                    portfolio={selectedMaster.portfolio}
                    rating={selectedMaster.rating}
                    reviews={selectedMaster.reviews}
                    onClose={() => setSelectedMaster(null)}
                />
            )}

            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onSuccess={handleAuthSuccess}
                />
            )}

            {showUserProfile && user && (
                <UserProfile
                    user={user}
                    onClose={() => setShowUserProfile(false)}
                    onUpdateUser={handleUpdateUser}
                />
            )}
        </div>
    );
}