// contexts/NotificationContext.tsx - Improved error messages
import React, {createContext, useContext, useCallback, useState, type ReactNode} from 'react';

// Notification types
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Interface for a notification
export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number; // Duration in ms, undefined = no auto-close
    title?: string;
}

// Interface for the context
interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
    // Helpers for common use cases
    showSuccess: (message: string, title?: string, duration?: number) => void;
    showError: (message: string, title?: string, duration?: number) => void;
    showInfo: (message: string, title?: string, duration?: number) => void;
    showWarning: (message: string, title?: string, duration?: number) => void;
    // Helper for HTTP errors
    handleHttpError: (error: unknown) => void;
}

// Create the context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Props for the provider
interface NotificationProviderProps {
    children: ReactNode;
    maxNotifications?: number; // Limit the number of simultaneous notifications
}

// Default duration configuration
const DEFAULT_DURATIONS = {
    success: 3000, // 3 seconds
    error: 5000,   // 5 seconds
    info: 4000,    // 4 seconds
    warning: 4000  // 4 seconds
};

// Utility function to avoid duplicate errors
const getUniqueErrorMessage = (error: unknown): string => {
    if (typeof error === 'object' && error !== null) {
        // @ts-ignore - Axios error handling
        if (error.isAxiosError) {
            // @ts-ignore - Access to Axios properties
            const status = error.response?.status;
            // @ts-ignore - Error message
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred';

            // Specific case for network connection errors
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

// Context provider
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
                                                                              children,
                                                                              maxNotifications = 5
                                                                          }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Used to track recent errors and avoid duplicates
    const [recentErrors] = useState<Set<string>>(new Set());

    // Add a new notification
    const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        const id = Date.now().toString();
        const newNotification = { ...notification, id };

        // For error notifications, check if it's a duplicate
        if (notification.type === 'error') {
            // If this error has already been displayed recently, don't add it again
            if (recentErrors.has(notification.message)) {
                return id;
            }

            // Add this error message to the list of recent errors
            recentErrors.add(notification.message);

            // Remove this error from the list after a certain time
            setTimeout(() => {
                recentErrors.delete(notification.message);
            }, 5000); // 5 seconds of "cooldown" between identical errors
        }

        setNotifications(currentNotifications => {
            // If we've reached the maximum, remove the oldest one
            let updatedNotifications = [...currentNotifications];
            if (updatedNotifications.length >= maxNotifications) {
                updatedNotifications = updatedNotifications.slice(1);
            }
            return [...updatedNotifications, newNotification];
        });

        // Auto-remove after the specified duration
        if (notification.duration) {
            setTimeout(() => {
                removeNotification(id);
            }, notification.duration);
        }

        return id;
    }, [maxNotifications, recentErrors]);

    // Remove a notification
    const removeNotification = useCallback((id: string) => {
        setNotifications(currentNotifications =>
            currentNotifications.filter(notification => notification.id !== id)
        );
    }, []);

    // Helper for success notifications
    const showSuccess = useCallback((message: string, title?: string, duration: number = DEFAULT_DURATIONS.success) => {
        addNotification({
            type: 'success',
            message,
            title: title || 'Success',
            duration
        });
    }, [addNotification]);

    // Helper for error notifications
    const showError = useCallback((message: string, title?: string, duration: number = DEFAULT_DURATIONS.error) => {
        addNotification({
            type: 'error',
            message,
            title: title || 'Error',
            duration
        });
    }, [addNotification]);

    // Helper for info notifications
    const showInfo = useCallback((message: string, title?: string, duration: number = DEFAULT_DURATIONS.info) => {
        addNotification({
            type: 'info',
            message,
            title: title || 'Information',
            duration
        });
    }, [addNotification]);

    // Helper for warning notifications
    const showWarning = useCallback((message: string, title?: string, duration: number = DEFAULT_DURATIONS.warning) => {
        addNotification({
            type: 'warning',
            message,
            title: title || 'Warning',
            duration
        });
    }, [addNotification]);

    // Helper for handling HTTP errors
    const handleHttpError = useCallback((error: unknown) => {
        console.error('HTTP Error:', error);

        // Axios or similar error
        if (typeof error === 'object' && error !== null) {
            // @ts-ignore - Axios error handling
            if (error.isAxiosError) {
                // @ts-ignore - Access to Axios properties
                const status = error.response?.status;
                // @ts-ignore - Error message
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
                        // Network error
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
                // Standard JavaScript errors
                showError(getUniqueErrorMessage(error), 'Error');
            } else {
                // Other type of error object
                showError('An unexpected error occurred', 'Error');
            }
        } else if (typeof error === 'string') {
            // If the error is just a string
            showError(error, 'Error');
        } else {
            // Fallback for any other type of error
            showError('An unexpected error occurred', 'Error');
        }
    }, [showError]);

    // Context value
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

// Hook to use the context
export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};