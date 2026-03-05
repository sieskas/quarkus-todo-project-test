import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNotification } from '../../contexts/NotificationContext';
import { NotificationToast } from './NotificationToast';

export const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    if (!notifications.length) return null;

    return (
        <View style={styles.container}>
            {notifications.map(notification => (
                <NotificationToast
                    key={notification.id}
                    notification={notification}
                    onDismiss={removeNotification}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 24,
        left: 16,
        right: 16,
        zIndex: 100,
    },
});
