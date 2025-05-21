package com.example.outcall.repository;

import com.example.domain.Toto;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class TotoRepository implements PanacheRepository<Toto> {
}