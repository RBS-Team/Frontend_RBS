import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, MessageCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {useNavigate} from "react-router-dom";

interface Message {
    id: string;
    text: string;
    isBot: boolean;
    category?: string;
}

interface SmartSearchProps {
    onClose: () => void;
    onCategorySelect: (categoryTitle: string) => void;
}

export function SmartSearch({onCategorySelect }: SmartSearchProps) {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Привет! Я помогу вам найти идеального мастера. Расскажите, какая услуга вас интересует?',
            isBot: true
        }
    ]);

    const onClose = () =>{
        navigate(-1)
    }
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const categoryKeywords = {
        'Парикмахерские услуги': [
            'стрижка', 'волосы', 'прическа', 'окрашивание', 'мелирование', 'укладка',
            'парикмахер', 'стилист', 'волос', 'покрасить', 'постричь', 'подстричь',
            'челка', 'каре', 'локоны', 'выпрямление', 'кератин', 'ботокс для волос'
        ],
        'Маникюр и педикюр': [
            'маникюр', 'педикюр', 'ногти', 'гель-лак', 'наращивание ногтей',
            'френч', 'покрытие', 'шеллак', 'дизайн ногтей', 'нейл', 'nail'
        ],
        'Макияж': [
            'макияж', 'мейкап', 'визаж', 'тональный', 'помада', 'тени',
            'вечерний макияж', 'свадебный макияж', 'дневной макияж', 'makeup',
            'красить глаза', 'красить губы', 'мэйкап'
        ],
        'Косметология': [
            'косметолог', 'чистка лица', 'пилинг', 'уход за лицом', 'процедуры',
            'косметология', 'лазер', 'мезотерапия', 'биоревитализация', 'ботокс',
            'филлеры', 'акне', 'прыщи', 'морщины', 'anti-age', 'антивозрастной'
        ],
        'Брови и ресницы': [
            'брови', 'ресницы', 'наращивание ресниц', 'ламинирование',
            'оформление бровей', 'окрашивание бровей', 'архитектура бровей',
            'коррекция бровей', 'перманент', 'микроблейдинг', 'lashes'
        ],
        'Массаж': [
            'массаж', 'расслабляющий', 'спортивный массаж', 'антицеллюлитный',
            'лимфодренаж', 'массажист', 'спина', 'шея', 'тело'
        ],
        'SPA процедуры': [
            'spa', 'спа', 'обертывание', 'ванна', 'релакс', 'хаммам',
            'сауна', 'баня', 'джакузи', 'гидромассаж'
        ],
        'Эпиляция': [
            'эпиляция', 'депиляция', 'шугаринг', 'воск', 'лазерная эпиляция',
            'удаление волос', 'восковая', 'сахарная'
        ],
        'Татуаж': [
            'татуаж', 'перманентный макияж', 'микроблейдинг', 'пудровые брови',
            'перманент губ', 'стрелки', 'межресничка', 'пигментация'
        ]
    };

    const suggestedQuestions = [
        'Хочу подстричься',
        'Нужен маникюр',
        'Макияж на свадьбу',
        'Массаж спины'
    ];

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const detectCategory = (text: string): string | null => {
        const lowerText = text.toLowerCase();

        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            if (keywords.some(keyword => lowerText.includes(keyword))) {
                return category;
            }
        }

        return null;
    };

    const getBotResponse = (userMessage: string): { text: string; category?: string } => {
        const detectedCategory = detectCategory(userMessage);

        if (detectedCategory) {
            return {
                text: `Отлично! Я подобрал для вас категорию "${detectedCategory}". Сейчас покажу вам лучших мастеров в этой области.`,
                category: detectedCategory
            };
        }

        return {
            text: 'Извините, я не совсем понял, какая услуга вас интересует. Попробуйте уточнить запрос. Например: "хочу сделать маникюр" или "нужна стрижка".'
        };
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            isBot: false
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            const botResponse = getBotResponse(inputValue);
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponse.text,
                isBot: true,
                category: botResponse.category
            };

            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);

            if (botResponse.category) {
                setTimeout(() => {
                    onCategorySelect(botResponse.category!);
                }, 1500);
            }
        }, 1000);
    };

    const handleSuggestedQuestion = (question: string) => {
        setInputValue(question);
    };

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl mb-1">Умный поиск</h1>
                                <p className="text-white/80 text-sm">Опишите, что вам нужно, и я подберу категорию</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {messages.length === 1 && (
                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-3">Попробуйте один из вариантов:</p>
                            <div className="grid grid-cols-2 gap-3">
                                {suggestedQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestedQuestion(question)}
                                        className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all text-left text-sm"
                                    >
                                        <Search size={16} className="inline mr-2 text-pink-600" />
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`flex gap-3 max-w-[80%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            message.isBot
                                                ? 'bg-gradient-to-br from-pink-500 to-purple-600'
                                                : 'bg-gray-300'
                                        }`}>
                                            {message.isBot ? (
                                                <Sparkles size={20} className="text-white" />
                                            ) : (
                                                <MessageCircle size={20} className="text-gray-600" />
                                            )}
                                        </div>
                                        <div className={`rounded-2xl px-4 py-3 ${
                                            message.isBot
                                                ? 'bg-white border border-gray-200'
                                                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                                        }`}>
                                            <p className="text-sm leading-relaxed">{message.text}</p>
                                            {message.category && (
                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                        Перенаправление...
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-start"
                            >
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <Sparkles size={20} className="text-white" />
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>

            <div className="bg-white border-t border-gray-200 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Опишите, что вам нужно..."
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                            disabled={isTyping}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isTyping}
                            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Send size={20} />
                            Отправить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
