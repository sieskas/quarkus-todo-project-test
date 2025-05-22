package com.example.api.v1.controllers;

import com.example.api.v1.dto.TodoRequestDTO;
import com.example.api.v1.dto.TodoResponseDTO;
import com.example.domain.Todo;
import com.example.service.TodoService;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;
import java.util.stream.Collectors;

@Path("/api/v1/todos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes({MediaType.APPLICATION_JSON, MediaType.WILDCARD})
@Tag(name = "Todo", description = "Operations related to task management")
public class TodoController {

    private final TodoService service;

    @ConfigProperty(name = "app.demo.test")
    private String test;

    public TodoController(TodoService service) {
        this.service = service;
    }

    @GET
    @Operation(
            summary = "Get all todos",
            description = "Retrieves all todo items from the system.",
            operationId = "getAllTodos"
    )
    public List<TodoResponseDTO> getAll() {
        return service.getAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @GET
    @Path("/{id}")
    @Operation(
            summary = "Get a todo by ID",
            description = "Retrieves a specific todo item by its ID.",
            operationId = "getTodoById"
    )
    public TodoResponseDTO getById(@PathParam("id") Long id) {
        return toResponse(service.getById(id));
    }

    @POST
    @Operation(
            summary = "Create a new todo",
            description = "Creates a new todo item with the provided information.",
            operationId = "createTodo"
    )
    public Response create(TodoRequestDTO request) {
        Todo todo = toEntity(request);
        Todo created = service.create(todo);
        return Response.status(Response.Status.CREATED).entity(toResponse(created)).build();
    }

    @PUT
    @Path("/{id}")
    @Operation(
            summary = "Update an existing todo",
            description = "Updates an existing todo item based on the provided ID and content.",
            operationId = "updateTodo"
    )
    public Response update(@PathParam("id") Long id, TodoRequestDTO request) {
        service.update(id, toEntity(request));
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}")
    @Operation(
            summary = "Delete a todo by ID",
            description = "Deletes a specific todo item based on its ID.",
            operationId = "deleteTodo"
    )
    public Response delete(@PathParam("id") Long id) {
        service.delete(id);
        return Response.noContent().build();
    }

    private TodoResponseDTO toResponse(Todo todo) {
        return TodoResponseDTO.builder()
                .id(todo.getId())
                .title(todo.getTitle())
                .description(todo.getDescription())
                .done(todo.isDone())
                .build();
    }

    private Todo toEntity(TodoRequestDTO dto) {
        Todo todo = new Todo();
        todo.setTitle(dto.title);
        todo.setDescription(dto.description);
        todo.setDone(dto.done);
        return todo;
    }

    @GET
    @Path("/test")
    @Produces(MediaType.TEXT_PLAIN)
    @Operation(
            summary = "Return test config value",
            description = "Returns a test configuration value for diagnostic purposes.",
            operationId = "getTestConfig"
    )
    public String getTest() {
        return test;
    }
}
