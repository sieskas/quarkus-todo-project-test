import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { Todo } from '../domain/models/Todo';
import { useNotification } from '../contexts/NotificationContext';
import { todoService } from '../services';

export const useTodos = () => {
    const { handleHttpError } = useNotification();

    const { data: todos = [], isLoading, isError, error } = useQuery<Todo[]>({
        queryKey: ['todos'],
        queryFn: () => todoService.getAll(),
    });

    useEffect(() => {
        if (isError && error) handleHttpError(error);
    }, [isError, error, handleHttpError]);

    return {
        todos,
        isLoading,
        isError,
        stats: todoService.computeStats(todos),
    };
};
