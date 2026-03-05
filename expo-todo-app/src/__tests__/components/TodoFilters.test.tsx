import React from 'react';
import { render } from '@testing-library/react-native';
import { TodoFilters } from '../../components/todo/TodoFilters';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

test('TodoFilters renders without crashing', () => {
    render(
        <TodoFilters
            searchTerm=""
            onSearchChange={jest.fn()}
            filter="all"
            onFilterChange={jest.fn()}
            sortDirection="asc"
            onSortToggle={jest.fn()}
        />
    );
});
