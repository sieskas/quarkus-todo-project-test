package com.example.api.v1.dto;

import lombok.Builder;

@Builder
public class TodoResponseDTO {
    public Long id;
    public String title;
    public String description;
    public boolean done;
}