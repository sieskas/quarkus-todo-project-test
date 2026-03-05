import type { Todo } from '../domain/models/Todo';

export type FilterType = 'all' | 'active' | 'completed';
export type SortDirection = 'asc' | 'desc';

export function filterAndSort(
    todos: Todo[],
    filter: FilterType,
    searchTerm: string,
    sortDirection: SortDirection,
): Todo[] {
    if (!todos.length) return [];

    let result = [...todos];

    if (filter === 'active') {
        result = result.filter(t => !t.isCompleted);
    } else if (filter === 'completed') {
        result = result.filter(t => t.isCompleted);
    }

    if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        result = result.filter(t =>
            t.title.toLowerCase().includes(term) ||
            (t.description && t.description.toLowerCase().includes(term))
        );
    }

    result.sort((a, b) => {
        const cmp = a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
}
