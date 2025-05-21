package com.example.api.v1.controllers;

import com.example.api.v1.dto.TotoDTO;
import com.example.service.TotoService;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/totos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes({MediaType.APPLICATION_JSON, MediaType.WILDCARD})
@Tag(name = "Toto")
public class TotoController {

    private final TotoService service;

    @ConfigProperty(name = "patate")
    private String patate;

    public TotoController(TotoService service) {
        this.service = service;
    }

    @GET
    public List<TotoDTO> getAll() {
        return service.getAll();
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        TotoDTO dto = service.getById(id);
        return dto != null ? Response.ok(dto).build() : Response.status(Response.Status.NOT_FOUND).build();
    }

    @POST
    @Operation(summary = "Creer un Toto")
    @APIResponse(responseCode = "201", description = "Toto cree")
    public Response create(
            @RequestBody(required = true,
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON,
                            schema = @Schema(implementation = TotoDTO.class)
                    )
            )
            TotoDTO dto
    ) {
        TotoDTO created = service.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") Long id, TotoDTO dto) {
        boolean updated = service.update(id, dto);
        return updated ? Response.ok().build() : Response.status(Response.Status.NOT_FOUND).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = service.delete(id);
        return deleted ? Response.noContent().build() : Response.status(Response.Status.NOT_FOUND).build();
    }

    @GET()
    @Path("/test")
    @Produces(MediaType.TEXT_PLAIN)
    public String getPatate() {
        return patate;
    }
}