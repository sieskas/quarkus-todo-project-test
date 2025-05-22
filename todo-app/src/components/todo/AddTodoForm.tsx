// components/todo/AddTodoForm.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTodoContext } from '../../contexts/TodoContext';
import { Todo } from '../../domain/models/Todo';
import { useTranslation } from 'react-i18next';

export const AddTodoForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createTodo, setIsAddingTask } = useTodoContext();
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const newTodo = Todo.create(title, description || undefined);
        setIsSubmitting(true);
        await createTodo(newTodo);
        setTitle('');
        setDescription('');
        setIsSubmitting(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && title.trim()) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    return (
        <div className="bg-blue-50 p-6 border-x border-b border-gray-200 rounded-b-lg mb-4 shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-blue-700">{t('addTodoForm.title')}</h2>
                <button
                    onClick={() => setIsAddingTask(false)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('addTodoForm.titleLabel')}
                    </label>
                    <input
                        id="title"
                        type="text"
                        placeholder={t('addTodoForm.titlePlaceholder')}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('addTodoForm.descriptionLabel')}
                    </label>
                    <textarea
                        id="description"
                        placeholder={t('addTodoForm.descriptionPlaceholder')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => setIsAddingTask(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        disabled={isSubmitting}
                    >
                        {t('addTodoForm.cancel')}
                    </button>
                    <button
                        type="submit"
                        disabled={!title.trim() || isSubmitting}
                        className={`px-4 py-2 rounded-md text-white ${
                            !title.trim() || isSubmitting
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isSubmitting ? t('addTodoForm.adding') : t('addTodoForm.add')}
                    </button>
                </div>
            </form>
        </div>
    );
};