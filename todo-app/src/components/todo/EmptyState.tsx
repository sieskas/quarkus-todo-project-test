// components/todo/EmptyState.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import { useTodoContext } from '../../contexts/TodoContext';
import { useTranslation } from 'react-i18next';

export const EmptyState: React.FC = () => {
    const { searchTerm, isAddingTask, setIsAddingTask } = useTodoContext();
    const { t } = useTranslation();

    return (
        <div className="text-center py-16 px-4">
            <p className="text-gray-500 mb-2">
                {searchTerm ? t('emptyState.noResults') : t('emptyState.noTasks')}
            </p>
            {!isAddingTask && !searchTerm && (
                <button
                    onClick={() => setIsAddingTask(true)}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                    <Plus size={16} className="mr-1" />
                    <span>{t('emptyState.addTask')}</span>
                </button>
            )}
        </div>
    );
};