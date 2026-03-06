import { filterAndSort } from '../../services/TodoFilterService';
import { Todo } from '../../domain/models/Todo';

const makeTodo = (id: number, title: string, done: boolean) =>
    new Todo(id, title, undefined, done);

const todos = [
    makeTodo(1, 'Banana', false),
    makeTodo(2, 'Apple', true),
    makeTodo(3, 'Cherry', false),
];

describe('filterAndSort', () => {
    it('returns all todos with filter "all"', () => {
        expect(filterAndSort(todos, 'all', '', 'asc')).toHaveLength(3);
    });

    it('filters active todos', () => {
        const result = filterAndSort(todos, 'active', '', 'asc');
        expect(result).toHaveLength(2);
        expect(result.every(t => !t.isCompleted)).toBe(true);
    });

    it('filters completed todos', () => {
        const result = filterAndSort(todos, 'completed', '', 'asc');
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('Apple');
    });

    it('sorts ascending', () => {
        const result = filterAndSort(todos, 'all', '', 'asc');
        expect(result.map(t => t.title)).toEqual(['Apple', 'Banana', 'Cherry']);
    });

    it('sorts descending', () => {
        const result = filterAndSort(todos, 'all', '', 'desc');
        expect(result.map(t => t.title)).toEqual(['Cherry', 'Banana', 'Apple']);
    });

    it('filters by search term on title', () => {
        const result = filterAndSort(todos, 'all', 'an', 'asc');
        expect(result.map(t => t.title)).toEqual(['Banana']);
    });

    it('filters by search term on description', () => {
        const withDesc = [
            new Todo(1, 'Task', 'buy groceries', false),
            new Todo(2, 'Other', 'nothing', false),
        ];
        const result = filterAndSort(withDesc, 'all', 'groceries', 'asc');
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('Task');
    });

    it('search is case-insensitive', () => {
        const result = filterAndSort(todos, 'all', 'APPLE', 'asc');
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('Apple');
    });

    it('returns empty array for empty input', () => {
        expect(filterAndSort([], 'all', '', 'asc')).toEqual([]);
    });
});
