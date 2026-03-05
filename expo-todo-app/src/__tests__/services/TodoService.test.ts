import { TodoService } from '../../services/TodoService';
import { Todo } from '../../domain/models/Todo';
import type { ITodoAdapter } from '../../outcall/taskmanager';

const mockAdapter: jest.Mocked<ITodoAdapter> = {
    getAllTodos: jest.fn(),
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
};

const service = new TodoService(mockAdapter);

beforeEach(() => jest.clearAllMocks());

describe('TodoService.computeStats', () => {
    it('computes stats correctly', () => {
        const todos = [
            new Todo(1, 'A', undefined, false),
            new Todo(2, 'B', undefined, true),
            new Todo(3, 'C', undefined, true),
        ];
        expect(service.computeStats(todos)).toEqual({ total: 3, completed: 2, active: 1 });
    });

    it('returns zeros for empty list', () => {
        expect(service.computeStats([])).toEqual({ total: 0, completed: 0, active: 0 });
    });
});

describe('TodoService.create', () => {
    it('maps todo to DTO and calls adapter', async () => {
        mockAdapter.createTodo.mockResolvedValue({ id: 1, title: 'Test', done: false });
        const todo = Todo.create('Test');
        await service.create(todo);
        expect(mockAdapter.createTodo).toHaveBeenCalledWith({ title: 'Test', description: undefined, done: false });
    });
});

describe('TodoService.toggle', () => {
    it('throws if todo has no id', async () => {
        const todo = Todo.create('No id');
        await expect(service.toggle(todo)).rejects.toThrow('Cannot toggle a todo without an ID');
    });

    it('calls updateTodo with toggled state', async () => {
        mockAdapter.updateTodo.mockResolvedValue({ id: 1, title: 'Test', done: true });
        const todo = new Todo(1, 'Test', undefined, false);
        await service.toggle(todo);
        expect(mockAdapter.updateTodo).toHaveBeenCalledWith(1, { title: 'Test', description: undefined, done: true });
    });
});

describe('TodoService.delete', () => {
    it('calls adapter with correct id', async () => {
        mockAdapter.deleteTodo.mockResolvedValue(undefined);
        await service.delete(42);
        expect(mockAdapter.deleteTodo).toHaveBeenCalledWith(42);
    });
});
