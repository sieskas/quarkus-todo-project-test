import React, { createContext, type ReactNode, useContext } from 'react';
import { useTodos } from '../hooks/useTodos';
import { useTodoFilters } from '../hooks/useTodoFilters';
import { useTodoMutations } from '../hooks/useTodoMutations';
import type { Todo } from '../domain/models/Todo';
import type { FilterType, SortDirection } from '../hooks/useTodoFilters';
import { useNotification } from './NotificationContext';

interface TodoContextType {
    todos: Todo[];
    displayedTodos: Todo[];
    isLoading: boolean;
    stats: { total: number; active: number; completed: number };
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filter: FilterType;
    setFilter: (filter: FilterType) => void;
    sortDirection: SortDirection;
    setSortDirection: (direction: SortDirection) => void;
    createTodo: (todo: Todo) => Promise<void>;
    updateTodo: (todo: Todo) => Promise<void>;
    toggleTodoCompletion: (todo: Todo) => Promise<void>;
    deleteTodo: (id: number) => Promise<void>;
    isCreating: boolean;
    isUpdating: boolean;
    isToggling: boolean;
    isDeleting: boolean;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { handleHttpError } = useNotification();

    const { todos, isLoading, stats } = useTodos();
    const { searchTerm, setSearchTerm, filter, setFilter, sortDirection, setSortDirection, getFilteredAndSortedTodos } = useTodoFilters();
    const {
        createTodo: createTodoMutation,
        updateTodo: updateTodoMutation,
        toggleTodoCompletion: toggleTodoCompletionMutation,
        deleteTodo: deleteTodoMutation,
        isCreating,
        isUpdating,
        isToggling,
        isDeleting,
    } = useTodoMutations();

    const displayedTodos = getFilteredAndSortedTodos(todos);

    const createTodo = async (todo: Todo): Promise<void> => {
        try {
            await createTodoMutation.mutateAsync(todo);
        } catch (error) {
            handleHttpError(error);
            throw error;
        }
    };

    const updateTodo = async (todo: Todo): Promise<void> => {
        try {
            await updateTodoMutation.mutateAsync(todo);
        } catch (error) {
            handleHttpError(error);
            throw error;
        }
    };

    const toggleTodoCompletion = async (todo: Todo): Promise<void> => {
        try {
            await toggleTodoCompletionMutation.mutateAsync(todo);
        } catch (error) {
            handleHttpError(error);
            throw error;
        }
    };

    const deleteTodo = async (id: number): Promise<void> => {
        try {
            await deleteTodoMutation.mutateAsync(id);
        } catch (error) {
            handleHttpError(error);
            throw error;
        }
    };

    return (
        <TodoContext.Provider value={{
            todos, displayedTodos, isLoading, stats,
            searchTerm, setSearchTerm, filter, setFilter, sortDirection, setSortDirection,
            createTodo, updateTodo, toggleTodoCompletion, deleteTodo,
            isCreating, isUpdating, isToggling, isDeleting,
        }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodoContext = (): TodoContextType => {
    const context = useContext(TodoContext);
    if (context === undefined) {
        throw new Error('useTodoContext must be used within a TodoProvider');
    }
    return context;
};
