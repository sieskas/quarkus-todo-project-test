import { Todo } from '../../domain/models/Todo';

describe('Todo', () => {
    it('creates a todo with default values', () => {
        const todo = Todo.create('My task');
        expect(todo.id).toBeNull();
        expect(todo.title).toBe('My task');
        expect(todo.isCompleted).toBe(false);
        expect(todo.description).toBeUndefined();
    });

    it('creates a todo with description', () => {
        const todo = Todo.create('My task', 'some description');
        expect(todo.description).toBe('some description');
    });

    it('toggles completion from false to true', () => {
        const todo = Todo.create('My task');
        const toggled = todo.toggleCompletion();
        expect(toggled.isCompleted).toBe(true);
    });

    it('toggles completion back to false', () => {
        const todo = Todo.create('My task');
        expect(todo.toggleCompletion().toggleCompletion().isCompleted).toBe(false);
    });

    it('is immutable — toggle returns a new instance', () => {
        const todo = Todo.create('My task');
        const toggled = todo.toggleCompletion();
        expect(toggled).not.toBe(todo);
        expect(todo.isCompleted).toBe(false);
    });

    it('updateTitle returns new instance with new title', () => {
        const todo = Todo.create('Old title');
        const updated = todo.updateTitle('New title');
        expect(updated.title).toBe('New title');
        expect(todo.title).toBe('Old title');
    });

    it('updateDescription returns new instance with new description', () => {
        const todo = Todo.create('Task', 'old desc');
        const updated = todo.updateDescription('new desc');
        expect(updated.description).toBe('new desc');
        expect(todo.description).toBe('old desc');
    });
});
