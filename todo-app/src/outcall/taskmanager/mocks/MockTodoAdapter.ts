import { faker } from '@faker-js/faker';
import type { TodoRequestDTO, TodoResponseDTO } from '../../../api/generated';
import type { ITodoAdapter } from '../TodoAdapter';

faker.seed(1);

let nextId = 1;

let store: TodoResponseDTO[] = Array.from({ length: 5 }, () => ({
    id: nextId++,
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    done: faker.datatype.boolean(),
}));

export class MockTodoAdapter implements ITodoAdapter {
    getAllTodos(): Promise<TodoResponseDTO[]> {
        return Promise.resolve([...store]);
    }

    createTodo(body: TodoRequestDTO): Promise<TodoResponseDTO> {
        const item: TodoResponseDTO = { ...body, id: nextId++ } as TodoResponseDTO;
        store = [...store, item];
        return Promise.resolve(item);
    }

    updateTodo(id: number, body: TodoRequestDTO): Promise<TodoResponseDTO> {
        store = store.map(t => t.id === id ? { ...t, ...body } : t);
        return Promise.resolve(store.find(t => t.id === id)!);
    }

    deleteTodo(id: number): Promise<void> {
        store = store.filter(t => t.id !== id);
        return Promise.resolve();
    }
}
