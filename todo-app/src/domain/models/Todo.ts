// domain/models/Todo.ts
export class Todo {
    readonly id: number | null;
    readonly title: string;
    readonly description: string | undefined;
    readonly isCompleted: boolean;

    constructor(id: number | null, title: string, description: string | undefined, isCompleted: boolean) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.isCompleted = isCompleted;
    }

    static create(title: string, description?: string): Todo {
        return new Todo(null, title, description, false);
    }

    toggleCompletion(): Todo {
        return new Todo(
            this.id,
            this.title,
            this.description,
            !this.isCompleted
        );
    }

    updateTitle(newTitle: string): Todo {
        return new Todo(
            this.id,
            newTitle,
            this.description,
            this.isCompleted
        );
    }

    updateDescription(newDescription?: string): Todo {
        return new Todo(
            this.id,
            this.title,
            newDescription,
            this.isCompleted
        );
    }
}