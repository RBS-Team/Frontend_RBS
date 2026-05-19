import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    onClose: (id: string) => void;
}

export function Toast({ id, message, type, duration = 3000, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const icons = {
        success: CheckCircle,
        error: XCircle,
        info: Info,
        warning: AlertCircle
    };

    const colors = {
        success: 'from-green-500 to-emerald-600',
        error: 'from-red-500 to-rose-600',
        info: 'from-blue-500 to-indigo-600',
        warning: 'from-orange-500 to-amber-600'
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
        warning: 'bg-orange-50 border-orange-200'
    };

    const textColors = {
        success: 'text-green-800',
        error: 'text-red-800',
        info: 'text-blue-800',
        warning: 'text-orange-800'
    };

    const Icon = icons[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${bgColors[type]} backdrop-blur-sm`}
        >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors[type]} flex items-center justify-center flex-shrink-0`}>
                <Icon className="text-white" size={20} />
            </div>
            <div className="flex-1 pt-1">
                <p className={`text-sm ${textColors[type]}`}>{message}</p>
            </div>
            <button
                onClick={() => onClose(id)}
                className={`p-1 rounded-lg hover:bg-white/50 transition-colors ${textColors[type]}`}
            >
                <X size={16} />
            </button>
        </motion.div>
    );
}

interface ToastContainerProps {
    toasts: Array<{
        id: string;
        message: string;
        type: ToastType;
    }>;
    onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-[200] space-y-3 max-w-md">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={onClose}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
