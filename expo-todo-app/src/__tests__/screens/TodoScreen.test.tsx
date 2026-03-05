import React from 'react';
import { render } from '@testing-library/react-native';
import { TodoScreen } from '../../screens/TodoScreen';
import { Todo } from '../../domain/models/Todo';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'en', changeLanguage: jest.fn() },
    }),
}));

jest.mock('expo-constants', () => ({
    default: { expoConfig: { version: '1.0.0' } },
}));

jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: any) => children,
}));

const mockContext = {
    displayedTodos: [],
    isLoading: false,
    stats: { total: 0, active: 0, completed: 0 },
    searchTerm: '',
    setSearchTerm: jest.fn(),
    filter: 'all',
    setFilter: jest.fn(),
    sortDirection: 'asc',
    setSortDirection: jest.fn(),
    createTodo: jest.fn(),
    toggleTodoCompletion: jest.fn(),
    deleteTodo: jest.fn(),
    isCreating: false,
    isUpdating: false,
    isToggling: false,
    isDeleting: false,
};

jest.mock('../../contexts/TodoContext', () => ({
    useTodoContext: () => mockContext,
}));

jest.mock('../../hooks/useWeather', () => ({
    useWeather: () => ({ data: { city: 'Paris', temp: 14, description: 'clear', icon: '01d' }, isLoading: false, isError: false }),
}));

test('TodoScreen renders empty state without crashing', () => {
    render(<TodoScreen />);
});

test('TodoScreen renders with todos without crashing', () => {
    mockContext.displayedTodos = [
        new Todo(1, 'Task one', undefined, false),
        new Todo(2, 'Task two', 'desc', true),
    ] as any;
    render(<TodoScreen />);
});

test('TodoScreen renders loading state without crashing', () => {
    mockContext.isLoading = true as any;
    mockContext.displayedTodos = [] as any;
    render(<TodoScreen />);
});

test('TodoScreen renders add form without crashing', () => {
    mockContext.isLoading = false as any;
    // isAddingTask is local state in TodoScreen, tested via user interaction
    render(<TodoScreen />);
});
