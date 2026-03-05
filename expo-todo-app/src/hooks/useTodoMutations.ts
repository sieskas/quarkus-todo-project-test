import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Todo } from '../domain/models/Todo';
import { useNotification } from '../contexts/NotificationContext';
import { useTranslation } from 'react-i18next';
import { todoService } from '../services';

export const useTodoMutations = () => {
    const queryClient = useQueryClient();
    const { showSuccess } = useNotification();
    const { t } = useTranslation();

    const createTodo = useMutation({
        mutationFn: (todo: Todo) => todoService.create(todo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            showSuccess(t('notifications.taskCreated'));
        },
    });

    const updateTodo = useMutation({
        mutationFn: (todo: Todo) => todoService.update(todo),
        onMutate: async (updatedTodo: Todo) => {
            if (updatedTodo.id === null) return;
            await queryClient.cancelQueries({ queryKey: ['todos'] });
            const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);
            if (previousTodos) {
                queryClient.setQueryData<Todo[]>(
                    ['todos'],
                    previousTodos.map(t => t.id === updatedTodo.id ? updatedTodo : t)
                );
            }
            return { previousTodos };
        },
        onError: (_error, _variables, context) => {
            if (context?.previousTodos) queryClient.setQueryData(['todos'], context.previousTodos);
        },
        onSuccess: () => showSuccess(t('notifications.taskUpdated')),
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    });

    const toggleTodoCompletion = useMutation({
        mutationFn: (todo: Todo) => todoService.toggle(todo),
        onMutate: async (todo: Todo) => {
            if (todo.id === null) return;
            await queryClient.cancelQueries({ queryKey: ['todos'] });
            const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);
            if (previousTodos) {
                queryClient.setQueryData<Todo[]>(
                    ['todos'],
                    previousTodos.map(t => t.id === todo.id ? todo.toggleCompletion() : t)
                );
            }
            return { previousTodos };
        },
        onError: (_error, _variables, context) => {
            if (context?.previousTodos) queryClient.setQueryData(['todos'], context.previousTodos);
        },
        onSuccess: (_, todo) => showSuccess(
            todo.isCompleted ? t('notifications.taskMarkedIncomplete') : t('notifications.taskMarkedComplete')
        ),
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    });

    const deleteTodo = useMutation({
        mutationFn: (id: number) => todoService.delete(id),
        onMutate: async (id: number) => {
            await queryClient.cancelQueries({ queryKey: ['todos'] });
            const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);
            if (previousTodos) {
                queryClient.setQueryData<Todo[]>(['todos'], previousTodos.filter(t => t.id !== id));
            }
            return { previousTodos };
        },
        onError: (_error, _variables, context) => {
            if (context?.previousTodos) queryClient.setQueryData(['todos'], context.previousTodos);
        },
        onSuccess: () => showSuccess(t('notifications.taskDeleted')),
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    });

    return {
        createTodo,
        updateTodo,
        toggleTodoCompletion,
        deleteTodo,
        isCreating: createTodo.isPending,
        isUpdating: updateTodo.isPending,
        isToggling: toggleTodoCompletion.isPending,
        isDeleting: deleteTodo.isPending,
    };
};
