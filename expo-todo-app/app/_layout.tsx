import '../src/localization/i18n';
import React from 'react';
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { NotificationProvider } from '../src/contexts/NotificationContext';
import { TodoProvider } from '../src/contexts/TodoContext';
import { NotificationContainer } from '../src/components/ui/NotificationContainer';
import { OpenAPI } from '../src/outcall/taskmanager';

SplashScreen.preventAutoHideAsync();

OpenAPI.BASE = process.env.EXPO_PUBLIC_TASK_MANAGER_API_URL ?? 'http://localhost:8080';

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <NotificationProvider>
                    <TodoProvider>
                        <StatusBar style="dark" />
                        <Slot />
                        <NotificationContainer />
                    </TodoProvider>
                </NotificationProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    );
}
