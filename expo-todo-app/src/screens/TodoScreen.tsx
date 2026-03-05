import React, { useState } from 'react';
import {
    ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { useTodoContext } from '../contexts/TodoContext';
import { TodoItem } from '../components/todo/TodoItem';
import { TodoFilters } from '../components/todo/TodoFilters';
import { AddTodoForm } from '../components/todo/AddTodoForm';
import { EmptyState } from '../components/todo/EmptyState';
import { LanguageSelector } from '../components/ui/LanguageSelector';
import { WeatherWidget } from '../components/ui/WeatherWidget';

const version = Constants.expoConfig?.version ?? '1.0.0';
const appEnv = process.env.EXPO_PUBLIC_ENV;
const versionLabel = appEnv && appEnv !== 'production' ? `${version}.${appEnv}` : version;

export const TodoScreen: React.FC = () => {
    const { t } = useTranslation();
    const [isAddingTask, setIsAddingTask] = useState(false);
    const {
        displayedTodos, isLoading, stats,
        searchTerm, setSearchTerm,
        filter, setFilter,
        sortDirection, setSortDirection,
        createTodo, toggleTodoCompletion, deleteTodo,
    } = useTodoContext();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={1}>{t('app.title')}</Text>
                    <View style={styles.headerRight}>
                        <WeatherWidget />
                        <LanguageSelector />
                    </View>
                </View>

                {/* Stats */}
                <Text style={styles.stats}>
                    {t('app.stats', { total: stats.total, active: stats.active, completed: stats.completed })}
                </Text>

                {isAddingTask ? (
                    <AddTodoForm
                        onAdd={async (todo) => { await createTodo(todo); setIsAddingTask(false); }}
                        onCancel={() => setIsAddingTask(false)}
                    />
                ) : (
                    <>
                        {/* Filters */}
                        <TodoFilters
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            filter={filter}
                            onFilterChange={setFilter}
                            sortDirection={sortDirection}
                            onSortToggle={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                        />

                        {/* List */}
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
                        ) : (
                            <FlatList
                                data={displayedTodos}
                                keyExtractor={item => String(item.id)}
                                renderItem={({ item }) => (
                                    <TodoItem
                                        todo={item}
                                        onToggle={toggleTodoCompletion}
                                        onDelete={deleteTodo}
                                    />
                                )}
                                ListEmptyComponent={<EmptyState hasSearch={!!searchTerm} />}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.listContent}
                            />
                        )}
                    </>
                )}

                {/* FAB */}
                {!isAddingTask && (
                    <TouchableOpacity style={styles.fab} onPress={() => setIsAddingTask(true)}>
                        <Text style={styles.fabIcon}>+</Text>
                    </TouchableOpacity>
                )}

                {/* Version */}
                <Text style={styles.version}>{versionLabel}</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        flex: 1,
        fontSize: 22,
        fontWeight: '800',
        color: '#1e293b',
        marginRight: 8,
    },
    stats: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 16,
    },
    loader: {
        marginTop: 48,
    },
    listContent: {
        paddingBottom: 80,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    fabIcon: {
        color: '#fff',
        fontSize: 28,
        lineHeight: 32,
    },
    version: {
        textAlign: 'center',
        fontSize: 11,
        color: '#cbd5e1',
        paddingBottom: 8,
    },
});
