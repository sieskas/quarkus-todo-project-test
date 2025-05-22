// -------------------------
// hooks/useTodoFilters.ts
// -------------------------
import { useState, useCallback } from 'react';
import type {Todo} from "../domain/models/Todo.ts";

export type FilterType = 'all' | 'active' | 'completed';
export type SortDirection = 'asc' | 'desc';

export const useTodoFilters = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const getFilteredAndSortedTodos = useCallback((todos: Todo[]): Todo[] => {
        if (!todos.length) return [];

        let filtered = [...todos];

        // Filter by status
        if (filter === 'active') {
            filtered = filtered.filter(todo => !todo.isCompleted);
        } else if (filter === 'completed') {
            filtered = filtered.filter(todo => todo.isCompleted);
        }

        // Filter by search
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(todo =>
                todo.title.toLowerCase().includes(term) ||
                (todo.description && todo.description.toLowerCase().includes(term))
            );
        }

        // Sort by title
        filtered.sort((a, b) => {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            if (sortDirection === 'asc') {
                return titleA.localeCompare(titleB);
            } else {
                return titleB.localeCompare(titleA);
            }
        });

        return filtered;
    }, [filter, searchTerm, sortDirection]);

    return {
        searchTerm,
        setSearchTerm,
        filter,
        setFilter,
        sortDirection,
        setSortDirection,
        getFilteredAndSortedTodos
    };
};