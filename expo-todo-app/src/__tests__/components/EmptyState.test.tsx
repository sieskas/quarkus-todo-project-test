import React from 'react';
import { render } from '@testing-library/react-native';
import { EmptyState } from '../../components/todo/EmptyState';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

test('EmptyState renders without search without crashing', () => {
    render(<EmptyState hasSearch={false} />);
});

test('EmptyState renders with search without crashing', () => {
    render(<EmptyState hasSearch={true} />);
});
