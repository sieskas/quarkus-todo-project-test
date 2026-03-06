import type { Todo } from '../domain/models/Todo';
import { mapToDomain, mapToDTO } from '../domain/mappers/todoMapper';
import type { ITodoAdapter } from '../outcall/taskmanager';

export interface TodoStats {
    total: number;
    completed: number;
    active: number;
}

export class TodoService {
    private readonly adapter: ITodoAdapter;

    constructor(adapter: ITodoAdapter) {
        this.adapter = adapter;
    }

    async getAll(): Promise<Todo[]> {
        const dtos = await this.adapter.getAllTodos();
        return dtos.map(mapToDomain);
    }

    async create(todo: Todo): Promise<void> {
        await this.adapter.createTodo(mapToDTO(todo));
    }

    async update(todo: Todo): Promise<void> {
        if (todo.id === null) throw new Error('Cannot update a todo without an ID');
        await this.adapter.updateTodo(todo.id, mapToDTO(todo));
    }

    async toggle(todo: Todo): Promise<void> {
        if (todo.id === null) throw new Error('Cannot toggle a todo without an ID');
        await this.adapter.updateTodo(todo.id, mapToDTO(todo.toggleCompletion()));
    }

    async delete(id: number): Promise<void> {
        await this.adapter.deleteTodo(id);
    }

    computeStats(todos: Todo[]): TodoStats {
        const completed = todos.filter(t => t.isCompleted).length;
        return { total: todos.length, completed, active: todos.length - completed };
    }
}
