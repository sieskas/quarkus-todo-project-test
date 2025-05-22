package com.example.service;

import com.example.domain.Todo;
import com.example.outcall.repository.TodoRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;

@ApplicationScoped
public class TodoService {

    private final TodoRepository repository;

    public TodoService(TodoRepository repository) {
        this.repository = repository;
    }

    public List<Todo> getAll() {
        return repository.listAll();
    }

    public Todo getById(Long id) {
        Todo todo = repository.findById(id);
        if (todo == null) {
            throw new NotFoundException("Todo not found with id " + id);
        }
        return todo;
    }

    @Transactional
    public Todo create(Todo todo) {
        repository.persist(todo);
        return todo;
    }

    @Transactional
    public void update(Long id, Todo updateData) {
        Todo existing = repository.findById(id);
        if (existing == null) {
            throw new NotFoundException("Cannot update non-existing Todo " + id);
        }
        existing.setTitle(updateData.getTitle());
        existing.setDescription(updateData.getDescription());
        existing.setDone(updateData.isDone());
    }

    @Transactional
    public void delete(Long id) {
        boolean deleted = repository.deleteById(id);
        if (!deleted) {
            throw new NotFoundException("Cannot delete non-existing Todo " + id);
        }
    }
}
