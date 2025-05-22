// components/ui/NotificationToast.tsx
import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import type {Notification, NotificationType} from '../../contexts/NotificationContext';

interface NotificationToastProps {
    notification: Notification;
    onClose: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
                                                                        notification,
                                                                        onClose
                                                                    }) => {
    const { id, type, title, message } = notification;

    const getToastConfig = (type: NotificationType) => {
        switch (type) {
            case 'success':
                return {
                    icon: <CheckCircle className="h-5 w-5" />,
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-400',
                    textColor: 'text-green-800',
                    iconColor: 'text-green-400',
                };
            case 'error':
                return {
                    icon: <XCircle className="h-5 w-5" />,
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-400',
                    textColor: 'text-red-800',
                    iconColor: 'text-red-400',
                };
            case 'warning':
                return {
                    icon: <AlertCircle className="h-5 w-5" />,
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-400',
                    textColor: 'text-yellow-800',
                    iconColor: 'text-yellow-400',
                };
            case 'info':
            default:
                return {
                    icon: <Info className="h-5 w-5" />,
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-400',
                    textColor: 'text-blue-800',
                    iconColor: 'text-blue-400',
                };
        }
    };

    const config = getToastConfig(type);

    return (
        <div
            className={`flex w-full max-w-md items-start p-4 mb-3 rounded-lg border ${config.bgColor} ${config.borderColor} shadow-sm`}
            role="alert"
        >
            <div className={`flex-shrink-0 ${config.iconColor}`}>
                {config.icon}
            </div>
            <div className="ml-3 w-full">
                {title && (
                    <h3 className={`text-sm font-medium ${config.textColor}`}>
                        {title}
                    </h3>
                )}
                <div className={`mt-1 text-sm ${config.textColor}`}>
                    {message}
                </div>
            </div>
            <button
                type="button"
                className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 ${config.iconColor} hover:bg-gray-100`}
                onClick={() => onClose(id)}
                aria-label="Fermer"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};
