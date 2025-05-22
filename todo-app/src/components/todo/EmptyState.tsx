// components/todo/EmptyState.tsx - Utilisation du contexte
import React from 'react';
import { Plus } from 'lucide-react';
import { useTodoContext } from '../../contexts/TodoContext';

export const EmptyState: React.FC = () => {
    const { searchTerm, isAddingTask, setIsAddingTask } = useTodoContext();

    return (
        <div className="text-center py-16 px-4">
            <p className="text-gray-500 mb-2">
                {searchTerm ? 'No results match your search' : 'No tasks yet'}
            </p>
            {!isAddingTask && !searchTerm && (
                <button
                    onClick={() => setIsAddingTask(true)}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                    <Plus size={16} className="mr-1" />
                    <span>Add a task</span>
                </button>
            )}
        </div>
    );
};