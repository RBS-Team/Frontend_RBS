import { Search, MapPin } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        Найдите своего мастера красоты
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Более 10 000 проверенных специалистов готовы сделать вас еще прекраснее
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                            <Search className="text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Услуга или специалист"
                                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                            <MapPin className="text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Город или район"
                                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                            Найти
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
