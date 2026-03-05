import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import type { Notification } from '../../contexts/NotificationContext';

const COLORS: Record<string, { bg: string; border: string; text: string }> = {
    success: { bg: '#f0fdf4', border: '#22c55e', text: '#15803d' },
    error:   { bg: '#fef2f2', border: '#ef4444', text: '#b91c1c' },
    info:    { bg: '#eff6ff', border: '#3b82f6', text: '#1d4ed8' },
    warning: { bg: '#fffbeb', border: '#f59e0b', text: '#b45309' },
};

interface Props {
    notification: Notification;
    onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<Props> = ({ notification, onDismiss }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const colors = COLORS[notification.type];

    useEffect(() => {
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { backgroundColor: colors.bg, borderLeftColor: colors.border, opacity }]}>
            {notification.title && <Text style={[styles.title, { color: colors.text }]}>{notification.title}</Text>}
            <Text style={[styles.message, { color: colors.text }]}>{notification.message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderLeftWidth: 4,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontWeight: '700',
        fontSize: 14,
        marginBottom: 2,
    },
    message: {
        fontSize: 13,
    },
});
