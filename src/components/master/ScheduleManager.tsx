import { useEffect, useState } from 'react';
import {
    Clock,
    Settings,
    X,
    ChevronLeft,
    ChevronRight,
    Plus,
    Trash2
} from 'lucide-react';
import { apiFetch } from '../../api/apiFetch';

export interface WorkDaySchedule {
    date: string; // Заменили day на конкретную дату YYYY-MM-DD
    enabled: boolean;
    slots: string[];
}

interface WorkInterval {
    date: string;
    end_time: string;
    id: string;
    master_id: string;
    start_time: string;
}

interface MasterSettings {
    slot_step_minutes: number;
    lead_time_minutes: number;
}

interface WorkScheduleProps {
    value?: WorkDaySchedule[];
    onChange?: (schedule: WorkDaySchedule[]) => void;
    masterId: string;
}

export function ScheduleManager({
                                    value,
                                    onChange,
                                    masterId,
                                }: WorkScheduleProps) {
    // Состояние календаря
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDateStr, setSelectedDateStr] = useState<string>(
        new Date().toISOString().split('T')[0]
    );

    const [schedule, setSchedule] = useState<WorkDaySchedule[]>(value || []);
    const [activeIntervals, setActiveIntervals] = useState<WorkInterval[]>([]);

    // Состояния настроек
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<MasterSettings | null>(null);
    const [settingsForm, setSettingsForm] = useState<MasterSettings | null>(null);

    // Новые стейты для добавления интервала вручную
    const [newStart, setNewStart] = useState('09:00');
    const [newEnd, setNewEnd] = useState('18:00');

    useEffect(() => {
        if (value) setSchedule(value);
    }, [value]);

    // Загрузка интервалов при смене месяца в календаре
    useEffect(() => {
        const fetchIntervals = async () => {
            try {
                // Берем с запасом: от начала текущего месяца до конца
                const from = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const to = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

                const format = (d: Date) => d.toISOString().split('T')[0];

                const res = await apiFetch(
                    `/masters/${masterId}/work-intervals?from=${format(from)}&to=${format(to)}`,
                    { method: 'GET' }
                );

                const normalizeTime = (time: string) => time.slice(0, 5);

                if (!res.ok) throw new Error('Ошибка загрузки интервалов');

                const intervals = (res.data.intervals || []).map((interval: WorkInterval) => ({
                    ...interval,
                    start_time: normalizeTime(interval.start_time),
                    end_time: normalizeTime(interval.end_time),
                }));

                setActiveIntervals(intervals);
            } catch (e) {
                console.error(e);
            }
        };

        if (masterId) fetchIntervals();
    }, [masterId, currentDate]);

    // Загрузка настроек мастера
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await apiFetch('/me/settings', { method: 'GET' });
                if (!res.ok) throw new Error('Ошибка загрузки настроек');
                setSettings(res.data);
                setSettingsForm(res.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchSettings();
    }, []);

    const saveSettings = async () => {
        if (!settingsForm) return;
        try {
            const res = await apiFetch('/me/settings', {
                method: 'PUT',
                body: JSON.stringify({
                    slot_step_minutes: Number(settingsForm.slot_step_minutes),
                    lead_time_minutes: Number(settingsForm.lead_time_minutes),
                }),
            });

            if (!res.ok) throw new Error('Ошибка сохранения настроек');
            setSettings(settingsForm);
            setSettingsOpen(false);
        } catch (e) {
            console.error(e);
            alert('Не удалось сохранить настройки');
        }
    };

    // Добавление нового интервала на выбранный день
    const addWorkInterval = async () => {
        try {
            const res = await apiFetch(`/me/work-intervals`, {
                method: 'POST',
                body: JSON.stringify({
                    date: selectedDateStr,
                    start_time: `${newStart}`,
                    end_time: `${newEnd}`,
                })
            });

            if (!res.ok) throw new Error('Не удалось добавить интервал график');

            // Предполагаем, что бэкенд возвращает созданный объект интервала
            const newInterval: WorkInterval = {
                id: res.data.id,
                master_id: masterId,
                date: selectedDateStr,
                start_time: newStart,
                end_time: newEnd
            };

            setActiveIntervals(prev => [...prev, newInterval]);
        } catch (e: any) {
            alert(e.message || 'Ошибка при добавлении');
        }
    };

    const deleteWorkInterval = async (intervalID: string) => {
        try {
            const res = await apiFetch(`/me/work-intervals/${intervalID}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                if (res.status === 409) {
                    throw new Error('Нельзя удалить интервал: есть активные записи');
                }
                throw new Error('Ошибка удаления интервала');
            }

            setActiveIntervals(prev => prev.filter(item => item.id !== intervalID));
        } catch (e: any) {
            console.error(e);
            alert(e.message || 'Ошибка удаления интервала');
        }
    };

    // Генерация массива дней для сетки календаря
    const generateCalendarCells = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // Сдвиг для дней недели (0 - Вс, 1 - Пн ...). Переводим на Пн = 0
        let startDayOffset = firstDayOfMonth.getDay() - 1;
        if (startDayOffset === -1) startDayOffset = 6;

        const cells = [];

        // Пустые ячейки для выравнивания начала месяца
        for (let i = 0; i < startDayOffset; i++) {
            cells.push(null);
        }

        // Заполнение днями месяца
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const date = new Date(year, month, day);
            // Корректное сохранение локальной даты без смещения часового пояса
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            cells.push({ day, dateStr });
        }

        return cells;
    };

    const intervalsForSelectedDate = activeIntervals.filter(
        item => item.date === selectedDateStr
    );

    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const changeMonth = (direction: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    };

    return (
        <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md space-y-6">
            {/* Хедер панели управления */}
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Управление графиком работы
                </h2>
                <button
                    onClick={() => setSettingsOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                    title="Настройки шага записи"
                >
                    <Settings className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Левая колонка: Календарь */}
                <div className="md:col-span-2 border rounded-xl p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>
                        <div className="flex gap-1">
                            <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-200 rounded">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-200 rounded">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Дни недели */}
                    <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
                        <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div className="text-red-500">Сб</div><div className="text-red-500">Вс</div>
                    </div>

                    {/* Сетка чисел */}
                    <div className="grid grid-cols-7 gap-1">
                        {generateCalendarCells().map((cell, idx) => {
                            if (!cell) return <div key={`empty-${idx}`} />;

                            const hasIntervals = activeIntervals.some(i => i.date === cell.dateStr);
                            const isSelected = selectedDateStr === cell.dateStr;

                            return (
                                <button
                                    key={cell.dateStr}
                                    onClick={() => setSelectedDateStr(cell.dateStr)}
                                    className={`
                                        h-12 flex flex-col items-center justify-between p-1 rounded-lg transition text-sm relative
                                        ${isSelected ? 'bg-indigo-600 text-white font-bold' : 'bg-white hover:bg-indigo-50 text-gray-800'}
                                        ${hasIntervals && !isSelected ? 'border border-indigo-400' : 'border border-gray-100'}
                                    `}
                                >
                                    <span>{cell.day}</span>
                                    {hasIntervals && (
                                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-600'}`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Правая колонка: Рабочие интервалы выбранного дня */}
                <div className="border rounded-xl p-4 bg-white flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-gray-700 mb-3">
                            График на: <span className="text-indigo-600">{selectedDateStr}</span>
                        </h3>

                        {/* Список текущих интервалов */}
                        <div className="space-y-2 mb-4 overflow-y-auto max-h-64">
                            {intervalsForSelectedDate.length === 0 ? (
                                <p className="text-sm text-gray-400 italic">Нет рабочих часов в этот день</p>
                            ) : (
                                intervalsForSelectedDate.map(interval => (
                                    <div key={interval.id} className="flex justify-between items-center bg-indigo-50 p-2.5 rounded-lg border border-indigo-100">
                                        <span className="text-sm font-medium text-gray-700">
                                            {interval.start_time} — {interval.end_time}
                                        </span>
                                        <button
                                            onClick={() => deleteWorkInterval(interval.id)}
                                            className="text-red-500 hover:text-red-700 p-1 transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Форма добавления нового интервала */}
                    <div className="border-t pt-4 space-y-3">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Добавить рабочие часы</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">С</label>
                                <input
                                    type="time"
                                    value={newStart}
                                    onChange={(e) => setNewStart(e.target.value)}
                                    className="w-full text-sm border rounded p-1.5 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">До</label>
                                <input
                                    type="time"
                                    value={newEnd}
                                    onChange={(e) => setNewEnd(e.target.value)}
                                    className="w-full text-sm border rounded p-1.5 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <button
                            onClick={addWorkInterval}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Добавить интервал
                        </button>
                    </div>
                </div>
            </div>

            {/* Модальное окно настроек мастера */}
            {settingsOpen && settingsForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setSettingsOpen(false)}
                            className="absolute top-4 rectangular right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold mb-4">Настройки записи</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Шаг слота записи (минут)
                                </label>
                                <input
                                    type="number"
                                    value={settingsForm.slot_step_minutes}
                                    onChange={(e) => setSettingsForm({
                                        ...settingsForm,
                                        slot_step_minutes: parseInt(e.target.value) || 0
                                    })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Минимальное время до записи (минут)
                                </label>
                                <input
                                    type="number"
                                    value={settingsForm.lead_time_minutes}
                                    onChange={(e) => setSettingsForm({
                                        ...settingsForm,
                                        lead_time_minutes: parseInt(e.target.value) || 0
                                    })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => setSettingsOpen(false)}
                                    className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={saveSettings}
                                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                                >
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
