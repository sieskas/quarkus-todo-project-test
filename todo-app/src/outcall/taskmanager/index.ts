import { TodoAdapter } from './TodoAdapter';
import { MockTodoAdapter } from './mocks/MockTodoAdapter';

export type { ITodoAdapter } from './TodoAdapter';
export { OpenAPI } from '../../api/generated';

const isMock = import.meta.env.VITE_TASK_MANAGER_MOCK_ENABLED === 'true'
    && import.meta.env.VITE_ENV !== 'production';

export const todoAdapter: ITodoAdapter = isMock ? new MockTodoAdapter() : new TodoAdapter();
