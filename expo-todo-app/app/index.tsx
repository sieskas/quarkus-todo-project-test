import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { TodoScreen } from '../src/screens/TodoScreen';
import { useTodoContext } from '../src/contexts/TodoContext';

export default function Index() {
    const { isLoading } = useTodoContext();

    useEffect(() => {
        if (!isLoading) {
            SplashScreen.hideAsync();
        }
    }, [isLoading]);

    return <TodoScreen />;
}
