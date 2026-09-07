package com.example.api.v1.controllers;
import com.example.api.v1.dto.WeatherResponseDTO;
import com.example.outcall.weather.OpenWeatherAdapter;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.openapi.annotations.Operation;

@Path("/api/v1/weather")
@Produces(MediaType.APPLICATION_JSON)
public class WeatherController {
    private final OpenWeatherAdapter adapter;
    public WeatherController(OpenWeatherAdapter adapter) { this.adapter = adapter; }
    @GET
    @Operation(summary="Get current weather", operationId="getWeather")
    public WeatherResponseDTO getWeather(@QueryParam("lat") Double lat, @QueryParam("lon") Double lon) {
        if (lat == null || lon == null || !Double.isFinite(lat) || !Double.isFinite(lon)
            || lat < -90 || lat > 90 || lon < -180 || lon > 180)
            throw new BadRequestException("Valid latitude and longitude are required");
        return adapter.getWeather(lat, lon);
    }
}
