import { TodoService } from '../../services/TodoService';
import { Todo } from '../../domain/models/Todo';
import type { ITodoAdapter } from '../../outcall/taskmanager';

const mockAdapter: {
    getAllTodos: ReturnType<typeof vi.fn>;
    createTodo: ReturnType<typeof vi.fn>;
    updateTodo: ReturnType<typeof vi.fn>;
    deleteTodo: ReturnType<typeof vi.fn>;
} = {
    getAllTodos: vi.fn(),
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
};

const service = new TodoService(mockAdapter as unknown as ITodoAdapter);

beforeEach(() => vi.clearAllMocks());

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

describe('TodoService.getAll', () => {
    it('maps DTOs to domain todos', async () => {
        mockAdapter.getAllTodos.mockResolvedValue([
            { id: 1, title: 'Test', done: false },
            { id: 2, title: 'Done', done: true },
        ]);
        const result = await service.getAll();
        expect(result).toHaveLength(2);
        expect(result[0]).toBeInstanceOf(Todo);
        expect(result[0].title).toBe('Test');
        expect(result[1].isCompleted).toBe(true);
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

describe('TodoService.update', () => {
    it('throws if todo has no id', async () => {
        const todo = Todo.create('No id');
        await expect(service.update(todo)).rejects.toThrow('Cannot update a todo without an ID');
    });

    it('calls updateTodo with correct args', async () => {
        mockAdapter.updateTodo.mockResolvedValue({ id: 1, title: 'Test', done: false });
        const todo = new Todo(1, 'Test', 'desc', false);
        await service.update(todo);
        expect(mockAdapter.updateTodo).toHaveBeenCalledWith(1, { title: 'Test', description: 'desc', done: false });
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
