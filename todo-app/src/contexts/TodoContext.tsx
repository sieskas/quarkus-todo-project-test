// contexts/TodoContext.tsx - Mise à jour pour supprimer la référence à isError
import React, {createContext, type ReactNode, useContext, useState} from 'react';
import { useTodos } from '../hooks/useTodos';
import { useTodoFilters } from '../hooks/useTodoFilters';
import { useTodoMutations } from '../hooks/useTodoMutations';
import type { Todo } from '../domain/models/Todo';
import type { FilterType, SortDirection } from '../hooks/useTodoFilters';
import { useNotification } from './NotificationContext';

// Interface mise à jour pour notre contexte (sans isError)
interface TodoContextType {
    // État des todos
    todos: Todo[];
    displayedTodos: Todo[];
    isLoading: boolean;
    stats: {
        total: number;
        active: number;
        completed: number;
    };

    // État des filtres
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filter: FilterType;
    setFilter: (filter: FilterType) => void;
    sortDirection: SortDirection;
    setSortDirection: (direction: SortDirection) => void;

    // Mutations
    createTodo: (todo: Todo) => Promise<void>;
    updateTodo: (todo: Todo) => Promise<void>;
    toggleTodoCompletion: (todo: Todo) => Promise<void>;
    deleteTodo: (id: number) => Promise<void>;

    // État d'UI
    isAddingTask: boolean;
    setIsAddingTask: (isAdding: boolean) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
    children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
    const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
    const { handleHttpError } = useNotification();

    // Récupérer les todos et les statistiques
    // Note: isError est toujours récupéré mais n'est plus exposé dans le contexte
    const { todos, isLoading, stats } = useTodos();

    // Récupérer les filtres et fonctions de tri
    const {
        searchTerm,
        setSearchTerm,
        filter,
        setFilter,
        sortDirection,
        setSortDirection,
        getFilteredAndSortedTodos
    } = useTodoFilters();

    // Récupérer les mutations
    const {
        createTodo: createTodoMutation,
        updateTodo: updateTodoMutation,
        toggleTodoCompletion: toggleTodoCompletionMutation,
        deleteTodo: deleteTodoMutation
    } = useTodoMutations();

    // Appliquer les filtres aux todos
    const displayedTodos = getFilteredAndSortedTodos(todos);

    // Wrapper les fonctions de mutation pour les simplifier et gérer les erreurs
    const createTodo = async (todo: Todo): Promise<void> => {
        try {
            await createTodoMutation.mutateAsync(todo);
            setIsAddingTask(false);
        } catch (error) {
            handleHttpError(error);
            throw error; // Re-throw pour que le composant puisse aussi réagir si nécessaire
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

    // Construire l'objet de valeur du contexte
    const contextValue: TodoContextType = {
        todos,
        displayedTodos,
        isLoading,
        stats,
        searchTerm,
        setSearchTerm,
        filter,
        setFilter,
        sortDirection,
        setSortDirection,
        createTodo,
        updateTodo,
        toggleTodoCompletion,
        deleteTodo,
        isAddingTask,
        setIsAddingTask
    };

    return (
        <TodoContext.Provider value={contextValue}>
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