import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface Props {
    hasSearch: boolean;
}

export const EmptyState: React.FC<Props> = ({ hasSearch }) => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Text style={styles.icon}>{hasSearch ? '🔍' : '📋'}</Text>
            <Text style={styles.text}>
                {hasSearch ? t('emptyState.noResults') : t('emptyState.noTasks')}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
    },
    icon: {
        fontSize: 48,
        marginBottom: 12,
    },
    text: {
        fontSize: 15,
        color: '#94a3b8',
        textAlign: 'center',
    },
});
