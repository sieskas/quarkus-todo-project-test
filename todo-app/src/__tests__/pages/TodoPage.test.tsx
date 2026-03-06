import React from 'react';
import { render } from '@testing-library/react';
import { TodoPage } from '../../pages/TodoPage';
import { Todo } from '../../domain/models/Todo';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'en', changeLanguage: vi.fn() },
    }),
}));

vi.mock('../../hooks/useWeather', () => ({
    useWeather: () => ({ data: { city: 'Paris', temp: 14, description: 'clear', icon: '01d' }, isLoading: false, isError: false }),
}));

const mockContext = {
    displayedTodos: [] as Todo[],
    isLoading: false,
    stats: { total: 0, active: 0, completed: 0 },
    searchTerm: '',
    setSearchTerm: vi.fn(),
    filter: 'all' as const,
    setFilter: vi.fn(),
    sortDirection: 'asc' as const,
    setSortDirection: vi.fn(),
    todos: [],
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    toggleTodoCompletion: vi.fn(),
    deleteTodo: vi.fn(),
    isAddingTask: false,
    setIsAddingTask: vi.fn(),
};

vi.mock('../../contexts/TodoContext', () => ({
    useTodoContext: () => mockContext,
}));

beforeEach(() => {
    mockContext.displayedTodos = [];
    mockContext.isLoading = false;
    mockContext.isAddingTask = false;
});

test('TodoPage renders empty state without crashing', () => {
    render(<TodoPage />);
});

test('TodoPage renders with todos without crashing', () => {
    mockContext.displayedTodos = [
        new Todo(1, 'Task one', undefined, false),
        new Todo(2, 'Task two', 'desc', true),
    ];
    render(<TodoPage />);
});

test('TodoPage renders loading state without crashing', () => {
    mockContext.isLoading = true;
    render(<TodoPage />);
});

test('TodoPage renders add form when isAddingTask is true', () => {
    mockContext.isAddingTask = true;
    render(<TodoPage />);
});
