// pages/TodoPage.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import { useTodoContext } from '../contexts/TodoContext';
import { TodoFilters } from '../components/todo/TodoFilters';
import { TodoItem } from '../components/todo/TodoItem';
import { AddTodoForm } from '../components/todo/AddTodoForm';
import { EmptyState } from '../components/todo/EmptyState';
import { useTranslation } from 'react-i18next';

export const TodoPage: React.FC = () => {
    const {
        displayedTodos,
        isLoading,
        stats,
        isAddingTask,
        setIsAddingTask
    } = useTodoContext();

    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto mt-8 px-4 pb-12">
            {/* Header with stats */}
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-blue-600">{t('app.title')}</h1>
                    <p className="text-gray-600 mt-1">
                        {t('app.stats', { total: stats.total, active: stats.active, completed: stats.completed })}
                    </p>
                </div>
                <button
                    onClick={() => setIsAddingTask(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                >
                    <Plus size={18} className="mr-1" />
                    <span>{t('buttons.newTask')}</span>
                </button>
            </div>

            {/* Filters component */}
            <TodoFilters />

            {/* Task addition form */}
            {isAddingTask && <AddTodoForm />}

            {/* Loading state */}
            {isLoading ? (
                <div className="py-12 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-b-lg border-x border-b border-gray-200 overflow-hidden shadow">
                    {displayedTodos.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {displayedTodos.map((todo) => (
                                <TodoItem key={todo.id ?? 'new'} todo={todo} />
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};