import React from 'react';
import { render } from '@testing-library/react-native';
import { TodoItem } from '../../components/todo/TodoItem';
import { Todo } from '../../domain/models/Todo';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

test('TodoItem renders an active todo without crashing', () => {
    const todo = new Todo(1, 'Buy milk', 'At the store', false);
    render(<TodoItem todo={todo} onToggle={jest.fn()} onDelete={jest.fn()} />);
});

test('TodoItem renders a completed todo without crashing', () => {
    const todo = new Todo(2, 'Done task', undefined, true);
    render(<TodoItem todo={todo} onToggle={jest.fn()} onDelete={jest.fn()} />);
});
