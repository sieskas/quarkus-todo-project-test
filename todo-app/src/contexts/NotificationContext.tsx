// contexts/NotificationContext.tsx
import React, {createContext, useContext, useCallback, useState, type ReactNode} from 'react';
import { useTranslation } from 'react-i18next';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number; // Duration in ms, undefined = no auto-close
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

interface NotificationProviderProps {
    children: ReactNode;
    maxNotifications?: number;
}

const DEFAULT_DURATIONS = {
    success: 3000,
    error: 5000,
    info: 4000,
    warning: 4000
};

const getUniqueErrorMessage = (error: unknown): string => {
    if (typeof error === 'object' && error !== null) {
        // @ts-ignore
        if (error.isAxiosError) {
            // @ts-ignore
            const status = error.response?.status;
            // @ts-ignore
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred';

            if (errorMessage.includes('Network Error') ||
                // @ts-ignore
                error.code === 'ERR_NETWORK' ||
                status === undefined) {
                return 'Unable to connect to the server. Please check your internet connection.';
            }

            return errorMessage;
        } else if (error instanceof Error) {
            return error.message;
        }
    } else if (typeof error === 'string') {
        return error;
    }

    return 'An unexpected error occurred';
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
                                                                              children,
                                                                              maxNotifications = 5
                                                                          }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [recentErrors] = useState<Set<string>>(new Set());
    const { t } = useTranslation();

    const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        const id = Date.now().toString();
        const newNotification = { ...notification, id };

        if (notification.type === 'error') {
            if (recentErrors.has(notification.message)) {
                return id;
            }

            recentErrors.add(notification.message);

            setTimeout(() => {
                recentErrors.delete(notification.message);
            }, 5000);
        }

        setNotifications(currentNotifications => {
            let updatedNotifications = [...currentNotifications];
            if (updatedNotifications.length >= maxNotifications) {
                updatedNotifications = updatedNotifications.slice(1);
            }
            return [...updatedNotifications, newNotification];
        });

        if (notification.duration) {
            setTimeout(() => {
                removeNotification(id);
            }, notification.duration);
        }

        return id;
    }, [maxNotifications, recentErrors]);

    const removeNotification = useCallback((id: string) => {
        setNotifications(currentNotifications =>
            currentNotifications.filter(notification => notification.id !== id)
        );
    }, []);

    const showSuccess = useCallback((message: string, title?: string, duration: number = DEFAULT_DURATIONS.success) => {
        addNotification({
            type: 'success',
            message,
            title: title || t('notifications.success'),
            duration
        });
    }, [addNotification, t]);

    const showError = useCallback((message: string, title?: string, duration: number = DEFAULT_DURATIONS.error) => {
        addNotification({
            type: 'error',
            message,
            title: title || t('notifications.error'),
            duration
        });
    }, [addNotification, t]);

    const showInfo = useCallback((message: string, title?: string, duration: number = DEFAULT_DURATIONS.info) => {
        addNotification({
            type: 'info',
            message,
            title: title || t('notifications.info'),
            duration
        });
    }, [addNotification, t]);

    const showWarning = useCallback((message: string, title?: string, duration: number = DEFAULT_DURATIONS.warning) => {
        addNotification({
            type: 'warning',
            message,
            title: title || t('notifications.warning'),
            duration
        });
    }, [addNotification, t]);

    const handleHttpError = useCallback((error: unknown) => {
        console.error('HTTP Error:', error);

        if (typeof error === 'object' && error !== null) {
            // @ts-ignore
            if (error.isAxiosError) {
                // @ts-ignore
                const status = error.response?.status;
                // @ts-ignore
                const errorMessage = error.response?.data?.message || error.message || t('errors.unknownError');

                switch (status) {
                    case 400:
                        showError(t('errors.invalidRequest', { message: errorMessage }), t('notifications.error') + ' 400');
                        break;
                    case 401:
                        showError(t('errors.unauthorized'), t('notifications.error'));
                        break;
                    case 403:
                        showError(t('errors.forbidden'), t('notifications.error'));
                        break;
                    case 404:
                        showError(t('errors.notFound'), t('notifications.error'));
                        break;
                    case 500:
                    case 502:
                    case 503:
                        showError(t('errors.serverError'), t('notifications.error'));
                        break;
                    default:
                        if (errorMessage.includes('Network Error') ||
                            // @ts-ignore
                            error.code === 'ERR_NETWORK' ||
                            status === undefined) {
                            showError(
                                t('errors.connectionError'),
                                t('notifications.error')
                            );
                        } else {
                            showError(errorMessage, `${t('notifications.error')} ${status || 'unknown'}`);
                        }
                }
            } else if (error instanceof Error) {
                showError(getUniqueErrorMessage(error), t('notifications.error'));
            } else {
                showError(t('errors.unknownError'), t('notifications.error'));
            }
        } else if (typeof error === 'string') {
            showError(error, t('notifications.error'));
        } else {
            showError(t('errors.unknownError'), t('notifications.error'));
        }
    }, [showError, t]);

    const contextValue = {
        notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        handleHttpError
    };

    return (
        <NotificationContext.Provider value={contextValue}>
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