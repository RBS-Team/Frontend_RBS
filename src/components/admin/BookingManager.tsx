import { FileText } from 'lucide-react';

export function BookingsManager() {
    return (
        <div className="text-center py-16">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={40} className="text-blue-600" />
            </div>
            <h3 className="mb-2">Управление записями</h3>
            <p className="text-gray-600">Этот раздел находится в разработке</p>
        </div>
    );
}
