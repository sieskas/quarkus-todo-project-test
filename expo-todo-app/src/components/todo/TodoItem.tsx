import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Todo } from '../../domain/models/Todo';

interface Props {
    todo: Todo;
    onToggle: (todo: Todo) => void;
    onDelete: (id: number) => void;
}

export const TodoItem: React.FC<Props> = ({ todo, onToggle, onDelete }) => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.checkbox, todo.isCompleted && styles.checkboxChecked]}
                onPress={() => onToggle(todo)}
                accessibilityLabel={todo.isCompleted ? t('todoItem.markIncomplete') : t('todoItem.markComplete')}
                testID="todo-toggle"
            >
                {todo.isCompleted && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={[styles.title, todo.isCompleted && styles.titleCompleted]}>
                    {todo.title}
                </Text>
                {todo.description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {todo.description}
                    </Text>
                )}
                <Text style={[styles.status, todo.isCompleted && styles.statusCompleted]}>
                    {todo.isCompleted ? t('todoItem.status.completed') : t('todoItem.status.todo')}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => todo.id !== null && onDelete(todo.id)}
                accessibilityLabel={t('todoItem.delete')}
                testID="todo-delete"
            >
                <Text style={styles.deleteIcon}>🗑</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#d1d5db',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    checkboxChecked: {
        backgroundColor: '#22c55e',
        borderColor: '#22c55e',
    },
    checkmark: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
    },
    titleCompleted: {
        textDecorationLine: 'line-through',
        color: '#94a3b8',
    },
    description: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
    },
    status: {
        fontSize: 11,
        fontWeight: '500',
        color: '#3b82f6',
        marginTop: 4,
    },
    statusCompleted: {
        color: '#22c55e',
    },
    deleteButton: {
        padding: 8,
    },
    deleteIcon: {
        fontSize: 16,
    },
});
