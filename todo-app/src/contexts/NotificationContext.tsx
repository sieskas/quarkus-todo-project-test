// contexts/NotificationContext.tsx
import React, {createContext, useContext, useCallback, useState, type ReactNode} from 'react';

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
            title: title || 'Success',
            duration
        });
    }, [addNotification]);

    const showError = useCallback((message: string, title?: string, duration: number = DEFAULT_DURATIONS.error) => {
        addNotification({
            type: 'error',
            message,
            title: title || 'Error',
            duration
        });
    }, [addNotification]);

    const showInfo = useCallback((message: string, title?: string, duration: number = DEFAULT_DURATIONS.info) => {
        addNotification({
            type: 'info',
            message,
            title: title || 'Information',
            duration
        });
    }, [addNotification]);

    const showWarning = useCallback((message: string, title?: string, duration: number = DEFAULT_DURATIONS.warning) => {
        addNotification({
            type: 'warning',
            message,
            title: title || 'Warning',
            duration
        });
    }, [addNotification]);

    const handleHttpError = useCallback((error: unknown) => {
        console.error('HTTP Error:', error);

        if (typeof error === 'object' && error !== null) {
            // @ts-ignore
            if (error.isAxiosError) {
                // @ts-ignore
                const status = error.response?.status;
                // @ts-ignore
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';

                switch (status) {
                    case 400:
                        showError(`Invalid request: ${errorMessage}`, 'Error 400');
                        break;
                    case 401:
                        showError('You must be logged in to perform this action', 'Unauthorized');
                        break;
                    case 403:
                        showError('You don\'t have the necessary permissions', 'Access Denied');
                        break;
                    case 404:
                        showError('The requested resource was not found', 'Resource Not Found');
                        break;
                    case 500:
                    case 502:
                    case 503:
                        showError('The server encountered an error. Please try again later.', 'Server Error');
                        break;
                    default:
                        if (errorMessage.includes('Network Error') ||
                            // @ts-ignore
                            error.code === 'ERR_NETWORK' ||
                            status === undefined) {
                            showError(
                                'Unable to connect to the server. Please check your internet connection.',
                                'Connection Error'
                            );
                        } else {
                            showError(errorMessage, `Error ${status || 'unknown'}`);
                        }
                }
            } else if (error instanceof Error) {
                showError(getUniqueErrorMessage(error), 'Error');
            } else {
                showError('An unexpected error occurred', 'Error');
            }
        } else if (typeof error === 'string') {
            showError(error, 'Error');
        } else {
            showError('An unexpected error occurred', 'Error');
        }
    }, [showError]);

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