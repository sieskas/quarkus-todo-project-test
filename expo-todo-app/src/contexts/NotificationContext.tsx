import React, { createContext, useContext, useCallback, useState, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../outcall/taskmanager/api/generated';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number;
    title?: string;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
    showSuccess: (message: string, title?: string, duration?: number) => void;
    showError: (message: string, title?: string, duration?: number) => void;
    showInfo: (message: string, title?: string, duration?: number) => void;
    showWarning: (message: string, title?: string, duration?: number) => void;
    handleHttpError: (error: unknown) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DEFAULT_DURATIONS = {
    success: 3000,
    error: 5000,
    info: 4000,
    warning: 4000,
};

export const NotificationProvider: React.FC<{ children: ReactNode; maxNotifications?: number }> = ({
    children,
    maxNotifications = 5,
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const recentErrors = useRef<Set<string>>(new Set());
    const { t } = useTranslation();

    const removeNotification = useCallback((id: string) => {
        setNotifications(current => current.filter(n => n.id !== id));
    }, []);

    const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        const id = Date.now().toString();

        if (notification.type === 'error') {
            if (recentErrors.current.has(notification.message)) return;
            recentErrors.current.add(notification.message);
            setTimeout(() => recentErrors.current.delete(notification.message), 5000);
        }

        setNotifications(current => {
            const updated = current.length >= maxNotifications ? current.slice(1) : [...current];
            return [...updated, { ...notification, id }];
        });

        if (notification.duration) {
            setTimeout(() => removeNotification(id), notification.duration);
        }
    }, [maxNotifications, recentErrors, removeNotification]);

    const showSuccess = useCallback((message: string, title?: string, duration = DEFAULT_DURATIONS.success) => {
        addNotification({ type: 'success', message, title: title || t('notifications.success'), duration });
    }, [addNotification, t]);

    const showError = useCallback((message: string, title?: string, duration = DEFAULT_DURATIONS.error) => {
        addNotification({ type: 'error', message, title: title || t('notifications.error'), duration });
    }, [addNotification, t]);

    const showInfo = useCallback((message: string, title?: string, duration = DEFAULT_DURATIONS.info) => {
        addNotification({ type: 'info', message, title: title || t('notifications.info'), duration });
    }, [addNotification, t]);

    const showWarning = useCallback((message: string, title?: string, duration = DEFAULT_DURATIONS.warning) => {
        addNotification({ type: 'warning', message, title: title || t('notifications.warning'), duration });
    }, [addNotification, t]);

    const handleHttpError = useCallback((error: unknown) => {
        console.error('HTTP Error:', error);

        if (error instanceof ApiError) {
            const status = error.status;
            const errorMessage = error.body?.message || error.message || t('errors.unknownError');

            switch (status) {
                case 400: showError(t('errors.invalidRequest', { message: errorMessage })); break;
                case 401: showError(t('errors.unauthorized')); break;
                case 403: showError(t('errors.forbidden')); break;
                case 404: showError(t('errors.notFound')); break;
                case 500:
                case 502:
                case 503: showError(t('errors.serverError')); break;
                default: showError(errorMessage);
            }
        } else if (typeof error === 'object' && error !== null) {
            if (error instanceof Error) {
                showError(error.message);
            } else {
                showError(t('errors.unknownError'));
            }
        } else if (typeof error === 'string') {
            showError(error);
        } else {
            showError(t('errors.unknownError'));
        }
    }, [showError, t]);

    return (
        <NotificationContext.Provider value={{
            notifications, addNotification, removeNotification,
            showSuccess, showError, showInfo, showWarning, handleHttpError,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
