/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TodoRequestDTO } from '../models/TodoRequestDTO';
import type { TodoResponseDTO } from '../models/TodoResponseDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TodoService {
    /**
     * Get all todos
     * Retrieves all todo items from the system.
     * @returns TodoResponseDTO OK
     * @throws ApiError
     */
    public static getAllTodos(): CancelablePromise<Array<TodoResponseDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/todos',
        });
    }
    /**
     * Create a new todo
     * Creates a new todo item with the provided information.
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static createTodo(
        requestBody: TodoRequestDTO,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/todos',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Return test config value
     * Returns a test configuration value for diagnostic purposes.
     * @returns string OK
     * @throws ApiError
     */
    public static getTestConfig(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/todos/test',
        });
    }
    /**
     * Update an existing todo
     * Updates an existing todo item based on the provided ID and content.
     * @param id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static updateTodo(
        id: number,
        requestBody: TodoRequestDTO,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/todos/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Get a todo by ID
     * Retrieves a specific todo item by its ID.
     * @param id
     * @returns TodoResponseDTO OK
     * @throws ApiError
     */
    public static getTodoById(
        id: number,
    ): CancelablePromise<TodoResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/todos/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Delete a todo by ID
     * Deletes a specific todo item based on its ID.
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static deleteTodo(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/todos/{id}',
            path: {
                'id': id,
            },
        });
    }
}
