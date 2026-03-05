import './src/localization/i18n';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { TodoProvider } from './src/contexts/TodoContext';
import { TodoScreen } from './src/screens/TodoScreen';
import { NotificationContainer } from './src/components/ui/NotificationContainer';
import { OpenAPI } from './src/outcall/taskmanager';
import { SafeAreaProvider } from 'react-native-safe-area-context';

OpenAPI.BASE = process.env.EXPO_PUBLIC_TASK_MANAGER_API_URL ?? 'http://localhost:8080';


const queryClient = new QueryClient();

export default function App() {
    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <NotificationProvider>
                    <TodoProvider>
                        <StatusBar style="dark" />
                        <TodoScreen />
                        <NotificationContainer />
                    </TodoProvider>
                </NotificationProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    );
}
