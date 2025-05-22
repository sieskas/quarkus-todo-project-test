// domain/mappers/todoMapper.ts
// domain/mappers/todoMapper.ts
import type {TodoResponseDTO, TodoRequestDTO} from '../../api/generated';
import {Todo} from '../models/Todo';

export const mapToDomain = (todoDTO: TodoResponseDTO): Todo => {
    return new Todo(
        todoDTO.id ?? null,
        todoDTO.title ?? '',
        todoDTO.description,
        todoDTO.done ?? false
    );
};

export const mapToDTO = (todo: Todo): TodoRequestDTO => {
    return {
        title: todo.title,
        description: todo.description,
        done: todo.isCompleted
    };
};