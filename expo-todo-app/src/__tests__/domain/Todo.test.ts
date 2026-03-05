import { Todo } from '../../domain/models/Todo';

describe('Todo', () => {
    it('creates a todo with default values', () => {
        const todo = Todo.create('My task');
        expect(todo.id).toBeNull();
        expect(todo.title).toBe('My task');
        expect(todo.isCompleted).toBe(false);
        expect(todo.description).toBeUndefined();
    });

    it('toggles completion', () => {
        const todo = Todo.create('My task');
        const toggled = todo.toggleCompletion();
        expect(toggled.isCompleted).toBe(true);
        expect(toggled.toggleCompletion().isCompleted).toBe(false);
    });

    it('is immutable — toggle returns a new instance', () => {
        const todo = Todo.create('My task');
        const toggled = todo.toggleCompletion();
        expect(toggled).not.toBe(todo);
        expect(todo.isCompleted).toBe(false);
    });
});
