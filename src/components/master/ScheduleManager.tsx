import { useState } from 'react';
import { Clock, Check } from 'lucide-react';

interface DaySchedule {
    isWorking: boolean;
    startTime: string;
    endTime: string;
}

export function ScheduleManager() {
    const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({
        monday: { isWorking: true, startTime: '09:00', endTime: '18:00' },
        tuesday: { isWorking: true, startTime: '09:00', endTime: '18:00' },
        wednesday: { isWorking: true, startTime: '09:00', endTime: '18:00' },
        thursday: { isWorking: true, startTime: '09:00', endTime: '18:00' },
        friday: { isWorking: true, startTime: '09:00', endTime: '18:00' },
        saturday: { isWorking: true, startTime: '10:00', endTime: '16:00' },
        sunday: { isWorking: false, startTime: '10:00', endTime: '16:00' }
    });

    const days = [
        { key: 'monday', label: 'Понедельник' },
        { key: 'tuesday', label: 'Вторник' },
        { key: 'wednesday', label: 'Среда' },
        { key: 'thursday', label: 'Четверг' },
        { key: 'friday', label: 'Пятница' },
        { key: 'saturday', label: 'Суббота' },
        { key: 'sunday', label: 'Воскресенье' }
    ];

    const updateDay = (day: string, field: keyof DaySchedule, value: any) => {
        setSchedule({
            ...schedule,
            [day]: { ...schedule[day], [field]: value }
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Clock size={24} className="text-pink-600" />
                    <h2>График работы</h2>
                </div>

                <div className="space-y-4">
                    {days.map(({ key, label }) => (
                        <div
                            key={key}
                            className={`p-4 border rounded-lg transition-colors ${
                                schedule[key].isWorking ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={schedule[key].isWorking}
                                            onChange={(e) => updateDay(key, 'isWorking', e.target.checked)}
                                            className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                                        />
                                        <span className={schedule[key].isWorking ? '' : 'text-gray-400'}>
                      {label}
                    </span>
                                    </label>
                                </div>

                                {schedule[key].isWorking && (
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Начало</label>
                                            <input
                                                type="time"
                                                value={schedule[key].startTime}
                                                onChange={(e) => updateDay(key, 'startTime', e.target.value)}
                                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            />
                                        </div>
                                        <span className="text-gray-400 mt-6">—</span>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Окончание</label>
                                            <input
                                                type="time"
                                                value={schedule[key].endTime}
                                                onChange={(e) => updateDay(key, 'endTime', e.target.value)}
                                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            />
                                        </div>
                                    </div>
                                )}

                                {!schedule[key].isWorking && (
                                    <span className="text-gray-400 text-sm">Выходной</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <button className="w-full mt-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <Check size={20} />
                    Сохранить график
                </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                    💡 <strong>Совет:</strong> Клиенты смогут записываться только на указанные рабочие часы.
                    Убедитесь, что график актуален.
                </p>
            </div>
        </div>
    );
}
