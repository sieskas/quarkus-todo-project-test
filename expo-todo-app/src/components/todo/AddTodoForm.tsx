import React, { useState } from 'react';
import {
    StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Todo } from '../../domain/models/Todo';

interface Props {
    onAdd: (todo: Todo) => Promise<void>;
    onCancel: () => void;
}

export const AddTodoForm: React.FC<Props> = ({ onAdd, onCancel }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) return;
        setIsSubmitting(true);
        try {
            await onAdd(Todo.create(title.trim(), description.trim() || undefined));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.container}>
                <Text style={styles.formTitle}>{t('addTodoForm.title')}</Text>

                <Text style={styles.label}>{t('addTodoForm.titleLabel')}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={t('addTodoForm.titlePlaceholder')}
                    value={title}
                    onChangeText={setTitle}
                    placeholderTextColor="#94a3b8"
                    autoFocus
                />

                <Text style={styles.label}>{t('addTodoForm.descriptionLabel')}</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder={t('addTodoForm.descriptionPlaceholder')}
                    value={description}
                    onChangeText={setDescription}
                    placeholderTextColor="#94a3b8"
                    multiline
                    numberOfLines={3}
                />

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                        <Text style={styles.cancelLabel}>{t('addTodoForm.cancel')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.addButton, (!title.trim() || isSubmitting) && styles.addButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={!title.trim() || isSubmitting}
                    >
                        <Text style={styles.addLabel}>
                            {isSubmitting ? t('addTodoForm.adding') : t('addTodoForm.add')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    formTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#1e293b',
        marginBottom: 12,
        backgroundColor: '#f8fafc',
    },
    textArea: {
        minHeight: 72,
        textAlignVertical: 'top',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 4,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
    },
    cancelLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    addButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
    },
    addButtonDisabled: {
        backgroundColor: '#93c5fd',
    },
    addLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
});
