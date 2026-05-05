import { MapPin, TrendingUp } from 'lucide-react';

export function PopularCities() {
    const cities = [
        { name: 'Москва', masters: 4230, growth: '+12%' },
        { name: 'Санкт-Петербург', masters: 2840, growth: '+8%' },
        { name: 'Казань', masters: 1560, growth: '+15%' },
        { name: 'Екатеринбург', masters: 1340, growth: '+10%' },
        { name: 'Новосибирск', masters: 980, growth: '+7%' },
        { name: 'Краснодар', masters: 870, growth: '+18%' }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="mb-4">Популярные города</h2>
                    <p className="text-gray-600">Найдите мастера в вашем городе</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cities.map((city, index) => (
                        <div
                            key={index}
                            className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:from-pink-50 hover:to-purple-50 transition-all cursor-pointer border-2 border-transparent hover:border-pink-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                        <MapPin className="text-pink-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="mb-1">{city.name}</h3>
                                        <p className="text-sm text-gray-600">{city.masters} мастеров</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs">
                                    <TrendingUp size={12} />
                                    {city.growth}
                                </div>
                            </div>
                            <button className="w-full py-2 bg-white text-pink-600 rounded-lg hover:bg-pink-50 transition-colors text-sm border border-pink-200">
                                Смотреть мастеров
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
