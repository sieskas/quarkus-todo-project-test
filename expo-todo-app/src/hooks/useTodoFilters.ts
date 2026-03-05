import { useState, useCallback } from 'react';
import type { Todo } from '../domain/models/Todo';
import { filterAndSort } from '../services';
import type { FilterType, SortDirection } from '../services';

export type { FilterType, SortDirection };

export const useTodoFilters = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const getFilteredAndSortedTodos = useCallback(
        (todos: Todo[]) => filterAndSort(todos, filter, searchTerm, sortDirection),
        [filter, searchTerm, sortDirection]
    );

    return { searchTerm, setSearchTerm, filter, setFilter, sortDirection, setSortDirection, getFilteredAndSortedTodos };
};
