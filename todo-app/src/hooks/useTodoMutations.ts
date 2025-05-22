// hooks/useTodoMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoService } from '../api/generated';
import { mapToDTO } from '../domain/mappers/todoMapper';
import type { Todo } from '../domain/models/Todo';
import { useNotification } from '../contexts/NotificationContext';
import { useTranslation } from 'react-i18next';

export const useTodoMutations = () => {
    const queryClient = useQueryClient();
    const { showSuccess } = useNotification();
    const { t } = useTranslation();

    // Create todo
    const createTodo = useMutation({
        mutationFn: (todo: Todo) => {
            const todoDTO = mapToDTO(todo);
            return TodoService.createTodo(todoDTO);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            showSuccess(t('notifications.taskCreated'));
        },
    });

    // Update todo
    const updateTodo = useMutation({
        mutationFn: (todo: Todo) => {
            if (todo.id === null) {
                throw new Error('Cannot update a todo without an ID');
            }
            const todoDTO = mapToDTO(todo);
            return TodoService.updateTodo(todo.id, todoDTO);
        },
        onMutate: async (updatedTodo: Todo) => {
            if (updatedTodo.id === null) return;

            await queryClient.cancelQueries({ queryKey: ['todos'] });
            const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

            // Optimistically update the cache
            if (previousTodos) {
                queryClient.setQueryData<Todo[]>(
                    ['todos'],
                    previousTodos.map(todo =>
                        todo.id === updatedTodo.id ? updatedTodo : todo
                    )
                );
            }

            return { previousTodos };
        },
        onError: (_error, _variables, context) => {
            // We keep the state restoration but removed handleHttpError
            if (context?.previousTodos) {
                queryClient.setQueryData(['todos'], context.previousTodos);
            }
        },
        onSuccess: () => {
            showSuccess(t('notifications.taskUpdated'));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    // Toggle todo completion status
    const toggleTodoCompletion = useMutation({
        mutationFn: (todo: Todo) => {
            if (todo.id === null) {
                throw new Error('Cannot update a todo without an ID');
            }

            const updatedTodo = todo.toggleCompletion();
            const todoDTO = mapToDTO(updatedTodo);

            return TodoService.updateTodo(todo.id, todoDTO);
        },
        onMutate: async (todo: Todo) => {
            if (todo.id === null) return;

            await queryClient.cancelQueries({ queryKey: ['todos'] });
            const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

            // Create the updated todo with toggled completion
            const updatedTodo = todo.toggleCompletion();

            // Optimistically update the cache
            if (previousTodos) {
                queryClient.setQueryData<Todo[]>(
                    ['todos'],
                    previousTodos.map(t =>
                        t.id === todo.id ? updatedTodo : t
                    )
                );
            }

            return { previousTodos };
        },
        onError: (_error, _variables, context) => {
            // We keep the state restoration but removed handleHttpError
            if (context?.previousTodos) {
                queryClient.setQueryData(['todos'], context.previousTodos);
            }
        },
        onSuccess: (_, variables) => {
            const message = variables.isCompleted ?
                t('notifications.taskMarkedIncomplete') :
                t('notifications.taskMarkedComplete');
            showSuccess(message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    // Delete todo
    const deleteTodo = useMutation({
        mutationFn: (id: number) => TodoService.deleteTodo(id),
        onMutate: async (id: number) => {
            await queryClient.cancelQueries({ queryKey: ['todos'] });
            const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

            // Optimistically remove the todo from cache
            if (previousTodos) {
                queryClient.setQueryData<Todo[]>(
                    ['todos'],
                    previousTodos.filter(todo => todo.id !== id)
                );
            }

            return { previousTodos };
        },
        onError: (_error, _variables, context) => {
            // We keep the state restoration but removed handleHttpError
            if (context?.previousTodos) {
                queryClient.setQueryData(['todos'], context.previousTodos);
            }
        },
        onSuccess: () => {
            showSuccess(t('notifications.taskDeleted'));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    return {
        createTodo,
        updateTodo,
        toggleTodoCompletion,
        deleteTodo
    };
};