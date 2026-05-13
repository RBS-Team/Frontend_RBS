import { Users } from 'lucide-react';

interface MastersManagerProps {
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

export function MastersManager({ onShowToast }: MastersManagerProps) {
    return (
        <div className="text-center py-16">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={40} className="text-purple-600" />
            </div>
            <h3 className="mb-2">Управление мастерами</h3>
            <p className="text-gray-600">Этот раздел находится в разработке</p>
        </div>
    );
}
