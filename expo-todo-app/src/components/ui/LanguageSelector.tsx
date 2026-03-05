import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'es', label: 'ES' },
];

export const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language.split('-')[0];

    return (
        <View style={styles.container}>
            {LANGUAGES.map(lang => (
                <TouchableOpacity
                    key={lang.code}
                    style={[styles.button, currentLang === lang.code && styles.active]}
                    onPress={() => i18n.changeLanguage(lang.code)}
                >
                    <Text style={[styles.label, currentLang === lang.code && styles.activeLabel]}>
                        {lang.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 4,
    },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: '#f1f5f9',
    },
    active: {
        backgroundColor: '#3b82f6',
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
    },
    activeLabel: {
        color: '#fff',
    },
});
