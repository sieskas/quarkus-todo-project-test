package com.example.outcall.weather;

import com.example.api.v1.dto.WeatherResponseDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.WebApplicationException;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.net.http.*;
import java.time.Duration;
import java.util.Optional;

@ApplicationScoped
public class OpenWeatherAdapter {
    @ConfigProperty(name="weather.api-key") Optional<String> apiKey;
    @ConfigProperty(name="weather.base-url", defaultValue="https://api.openweathermap.org/data/2.5") String baseUrl;
    @Inject ObjectMapper mapper;
    private final HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(3)).build();

    public WeatherResponseDTO getWeather(double lat, double lon) {
        if (apiKey.isEmpty() || apiKey.get().isBlank())
            throw new WebApplicationException("Weather is not configured", 503);
        try {
            var uri = URI.create(baseUrl + "/weather?lat=" + lat + "&lon=" + lon
                + "&units=metric&appid=" + URLEncoder.encode(apiKey.get(), StandardCharsets.UTF_8));
            var response = client.send(HttpRequest.newBuilder(uri).timeout(Duration.ofSeconds(5)).GET().build(),
                HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) throw new WebApplicationException("Weather provider unavailable", 502);
            var data = mapper.readTree(response.body());
            var weather = data.path("weather").path(0);
            if (!data.path("name").isTextual() || !data.path("main").path("temp").isNumber()
                || !weather.path("description").isTextual() || !weather.path("icon").isTextual())
                throw new WebApplicationException("Invalid weather response", 502);
            return new WeatherResponseDTO(data.get("name").asText(), Math.round(data.get("main").get("temp").asDouble()),
                weather.get("description").asText(), weather.get("icon").asText());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new WebApplicationException("Weather request interrupted", 503);
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            // Never expose the upstream URL, key, or response body.
            throw new WebApplicationException("Weather provider unavailable", 502);
        }
    }
}
