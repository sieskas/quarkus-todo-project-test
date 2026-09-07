package com.example;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.common.QuarkusTestResource;
import org.junit.jupiter.api.Test;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
@QuarkusTest
@QuarkusTestResource(WeatherStub.class)
public class WeatherResourceTest {
    @Test void mapsProviderResponse(){
        given().queryParam("lat",45).queryParam("lon",-73).get("/api/v1/weather")
            .then().statusCode(200).body("city",equalTo("Montreal")).body("temp",equalTo(22))
            .body("description",equalTo("clear sky")).body("icon",equalTo("01d"));
    }
    @Test void rejectsInvalidCoordinates(){
        given().queryParam("lat",91).queryParam("lon",0).get("/api/v1/weather").then().statusCode(400);
        given().get("/api/v1/weather").then().statusCode(400);
        given().queryParam("lat","NaN").queryParam("lon",0).get("/api/v1/weather").then().statusCode(400);
    }
    @Test void sanitizesUpstreamFailure(){
        given().queryParam("lat",2).queryParam("lon",0).get("/api/v1/weather")
            .then().statusCode(502).body(not(containsString("test-only-key")));
    }
    @Test void rejectsMalformedProviderData(){
        given().queryParam("lat",3).queryParam("lon",0).get("/api/v1/weather").then().statusCode(502);
    }
}
