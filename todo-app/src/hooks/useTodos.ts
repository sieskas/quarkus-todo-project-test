// hooks/useTodos.ts - Improved error handling
import { useQuery } from '@tanstack/react-query';
import { TodoService } from '../api/generated';
import { mapToDomain } from '../domain/mappers/todoMapper';
import type { Todo } from '../domain/models/Todo';
import { useNotification } from '../contexts/NotificationContext';
import type { TodoResponseDTO } from '../api/generated';

export const useTodos = () => {
    const { handleHttpError } = useNotification();

    // Use queryFn with direct error handling
    const { data: todosDTO, isLoading, isError } = useQuery<TodoResponseDTO[]>({
        queryKey: ['todos'],
        queryFn: async () => {
            try {
                return await TodoService.getAllTodos();
            } catch (error) {
                // Pass the original error to the handler instead of creating a new one
                handleHttpError(error);
                throw error; // Important to propagate the original error
            }
        },
    });

    const todos: Todo[] = todosDTO ? todosDTO.map(mapToDomain) : [];

    // Calculate stats
    const totalTodos = todos.length;
    const completedTodos = todos.filter(todo => todo.isCompleted).length;
    const activeTodos = totalTodos - completedTodos;

    return {
        todos,
        isLoading,
        isError,
        stats: {
            total: totalTodos,
            completed: completedTodos,
            active: activeTodos
        }
    };
};