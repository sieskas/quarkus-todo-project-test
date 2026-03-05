import { TodoAdapter } from './TodoAdapter';
import { MockTodoAdapter } from './mocks/MockTodoAdapter';

export type { ITodoAdapter } from './TodoAdapter';
export { OpenAPI } from './api/generated';

const isMock = process.env.EXPO_PUBLIC_TASK_MANAGER_MOCK_ENABLED === 'true'
    && process.env.EXPO_PUBLIC_ENV !== 'production';

export const todoAdapter: ITodoAdapter = isMock ? new MockTodoAdapter() : new TodoAdapter();
