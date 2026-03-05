import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { FilterType, SortDirection } from '../../hooks/useTodoFilters';

interface Props {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    filter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    sortDirection: SortDirection;
    onSortToggle: () => void;
}

const FILTERS: FilterType[] = ['all', 'active', 'completed'];

export const TodoFilters: React.FC<Props> = ({
    searchTerm, onSearchChange,
    filter, onFilterChange,
    sortDirection, onSortToggle,
}) => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder={t('todoFilters.search')}
                value={searchTerm}
                onChangeText={onSearchChange}
                placeholderTextColor="#94a3b8"
            />

            <View style={styles.filterRow}>
                <View style={styles.filterButtons}>
                    {FILTERS.map(f => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterButton, filter === f && styles.filterButtonActive]}
                            onPress={() => onFilterChange(f)}
                        >
                            <Text style={[styles.filterLabel, filter === f && styles.filterLabelActive]}>
                                {t(`todoFilters.${f}`)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.sortButton} onPress={onSortToggle}>
                    <Text style={styles.sortIcon}>{sortDirection === 'asc' ? '↑' : '↓'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 8,
        marginBottom: 16,
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 14,
        color: '#1e293b',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    filterButtons: {
        flexDirection: 'row',
        gap: 6,
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
    },
    filterButtonActive: {
        backgroundColor: '#3b82f6',
    },
    filterLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748b',
    },
    filterLabelActive: {
        color: '#fff',
    },
    sortButton: {
        padding: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
    },
    sortIcon: {
        fontSize: 16,
        color: '#64748b',
    },
});
