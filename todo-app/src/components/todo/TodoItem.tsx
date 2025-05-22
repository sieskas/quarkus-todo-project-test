// components/todo/TodoItem.tsx
import React from 'react';
import { CheckSquare, Square, Trash2 } from 'lucide-react';
import { Todo } from '../../domain/models/Todo';
import { useTodoContext } from '../../contexts/TodoContext';
import { useTranslation } from 'react-i18next';

interface TodoItemProps {
    todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
    const { toggleTodoCompletion, deleteTodo } = useTodoContext();
    const { t } = useTranslation();

    const handleToggle = () => {
        if (todo.id !== null) {
            toggleTodoCompletion(todo);
        }
    };

    const handleDelete = () => {
        if (todo.id !== null) {
            deleteTodo(todo.id);
        }
    };

    return (
        <li className="group hover:bg-blue-50 transition-colors">
            <div className="flex items-start p-4">
                <button
                    onClick={handleToggle}
                    className="flex-shrink-0 mt-0.5 mr-3 text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label={todo.isCompleted ? t('todoItem.markIncomplete') : t('todoItem.markComplete')}
                >
                    {todo.isCompleted ? (
                        <CheckSquare size={20} className="text-blue-600" />
                    ) : (
                        <Square size={20} />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${todo.isCompleted ? 'text-blue-600' : 'text-gray-900'}`}>
                        {todo.title}
                    </p>
                    {todo.description && (
                        <p className="mt-1 text-sm text-gray-600">
                            {todo.description}
                        </p>
                    )}
                </div>

                <div className="ml-4 flex items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                        todo.isCompleted
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {todo.isCompleted ? t('todoItem.status.completed') : t('todoItem.status.todo')}
                    </span>
                    <button
                        onClick={handleDelete}
                        className="ml-3 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label={t('todoItem.delete')}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </li>
    );
};