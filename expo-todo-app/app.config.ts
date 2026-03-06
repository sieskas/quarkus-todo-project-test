import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'expo-todo-app',
    slug: 'expo-todo-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
        image: './assets/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.expo.todoapp',
    },
    android: {
        adaptiveIcon: {
            backgroundColor: '#E6F4FE',
            foregroundImage: './assets/android-icon-foreground.png',
            backgroundImage: './assets/android-icon-background.png',
            monochromeImage: './assets/android-icon-monochrome.png',
        },
    },
    web: {
        favicon: './assets/favicon.png',
        bundler: 'metro',
    },
    scheme: 'expo-todo-app',
    plugins: ['expo-router'],
});
