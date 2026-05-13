import { BarChart3 } from 'lucide-react';

export function AdminStats() {
    return (
        <div className="text-center py-16">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 size={40} className="text-green-600" />
            </div>
            <h3 className="mb-2">Статистика</h3>
            <p className="text-gray-600">Этот раздел находится в разработке</p>
        </div>
    );
}
