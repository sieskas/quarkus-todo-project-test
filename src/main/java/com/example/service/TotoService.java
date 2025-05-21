package com.example.service;

import com.example.api.v1.dto.TotoDTO;
import com.example.domain.Toto;
import com.example.outcall.repository.TotoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class TotoService {

    private final TotoRepository repository;

    public TotoService(TotoRepository repository) {
        this.repository = repository;
    }

    public List<TotoDTO> getAll() {
        return repository.listAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public TotoDTO getById(Long id) {
        return repository.findByIdOptional(id).map(this::toDto).orElse(null);
    }

    @Transactional
    public TotoDTO create(TotoDTO dto) {
        Toto entity = new Toto();
        entity.setName(dto.name);
        repository.persist(entity);
        dto.id = entity.getId();
        return dto;
    }

    @Transactional
    public boolean update(Long id, TotoDTO dto) {
        return repository.findByIdOptional(id).map(t -> {
            t.setName(dto.name);
            return true;
        }).orElse(false);
    }

    @Transactional
    public boolean delete(Long id) {
        return repository.deleteById(id);
    }

    private TotoDTO toDto(Toto t) {
        TotoDTO dto = new TotoDTO();
        dto.id = t.getId();
        dto.name = t.getName();
        return dto;
    }
}