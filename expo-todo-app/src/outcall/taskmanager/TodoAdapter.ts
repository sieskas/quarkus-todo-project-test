import type { TodoRequestDTO, TodoResponseDTO } from './api/generated';
import { TodoService } from './api/generated';

export interface ITodoAdapter {
    getAllTodos(): Promise<TodoResponseDTO[]>;
    createTodo(body: TodoRequestDTO): Promise<TodoResponseDTO>;
    updateTodo(id: number, body: TodoRequestDTO): Promise<TodoResponseDTO>;
    deleteTodo(id: number): Promise<void>;
}

export class TodoAdapter implements ITodoAdapter {
    getAllTodos(): Promise<TodoResponseDTO[]> {
        return TodoService.getAllTodos();
    }

    createTodo(body: TodoRequestDTO): Promise<TodoResponseDTO> {
        return TodoService.createTodo(body);
    }

    updateTodo(id: number, body: TodoRequestDTO): Promise<TodoResponseDTO> {
        return TodoService.updateTodo(id, body);
    }

    deleteTodo(id: number): Promise<void> {
        return TodoService.deleteTodo(id);
    }
}
