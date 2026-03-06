import { mapToDomain, mapToDTO } from '../../domain/mappers/todoMapper';
import { Todo } from '../../domain/models/Todo';
import type { TodoResponseDTO } from '../../api/generated';

describe('mapToDomain', () => {
    it('maps all fields correctly', () => {
        const dto: TodoResponseDTO = { id: 1, title: 'Test', description: 'desc', done: true };
        const todo = mapToDomain(dto);
        expect(todo.id).toBe(1);
        expect(todo.title).toBe('Test');
        expect(todo.description).toBe('desc');
        expect(todo.isCompleted).toBe(true);
    });

    it('defaults id to null when undefined', () => {
        const dto: TodoResponseDTO = { title: 'Test', done: false };
        const todo = mapToDomain(dto);
        expect(todo.id).toBeNull();
    });

    it('defaults title to empty string when undefined', () => {
        const dto: TodoResponseDTO = { id: 1, done: false };
        const todo = mapToDomain(dto);
        expect(todo.title).toBe('');
    });

    it('defaults done to false when undefined', () => {
        const dto: TodoResponseDTO = { id: 1, title: 'Test' };
        const todo = mapToDomain(dto);
        expect(todo.isCompleted).toBe(false);
    });

    it('description is undefined when not provided', () => {
        const dto: TodoResponseDTO = { id: 1, title: 'Test', done: false };
        const todo = mapToDomain(dto);
        expect(todo.description).toBeUndefined();
    });
});

describe('mapToDTO', () => {
    it('maps all fields correctly', () => {
        const todo = new Todo(1, 'Test', 'desc', true);
        const dto = mapToDTO(todo);
        expect(dto.title).toBe('Test');
        expect(dto.description).toBe('desc');
        expect(dto.done).toBe(true);
    });

    it('maps completed false correctly', () => {
        const todo = Todo.create('Task');
        const dto = mapToDTO(todo);
        expect(dto.done).toBe(false);
        expect(dto.description).toBeUndefined();
    });
});
