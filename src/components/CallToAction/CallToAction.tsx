import { Sparkles, ArrowRight } from 'lucide-react';

export function CallToAction() {
    return (
        <section className="py-20 bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center border border-white/20">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                            <Sparkles className="text-white" size={40} />
                        </div>
                    </div>

                    <h2 className="text-white mb-4 text-3xl md:text-4xl">
                        Готовы преобразиться?
                    </h2>
                    <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                        Присоединяйтесь к тысячам довольных клиентов, которые уже нашли своих идеальных мастеров
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="group px-8 py-4 bg-white text-pink-600 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl">
                            Найти мастера
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors border-2 border-white/30">
                            Стать мастером
                        </button>
                    </div>

                    <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                        <div className="text-white">
                            <p className="text-3xl mb-1">10K+</p>
                            <p className="text-white/70 text-sm">Мастеров</p>
                        </div>
                        <div className="text-white">
                            <p className="text-3xl mb-1">50K+</p>
                            <p className="text-white/70 text-sm">Записей</p>
                        </div>
                        <div className="text-white">
                            <p className="text-3xl mb-1">4.9</p>
                            <p className="text-white/70 text-sm">Средний рейтинг</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
