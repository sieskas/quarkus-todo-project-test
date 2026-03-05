import React from 'react';
import { render } from '@testing-library/react-native';
import { AddTodoForm } from '../../components/todo/AddTodoForm';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

test('AddTodoForm renders without crashing', () => {
    render(<AddTodoForm onAdd={jest.fn()} onCancel={jest.fn()} />);
});
