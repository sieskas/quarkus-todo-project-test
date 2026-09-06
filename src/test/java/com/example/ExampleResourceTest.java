package com.example;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

@QuarkusTest
public class ExampleResourceTest {
    @Test
    public void todoLifecycle() {
        int id = given().contentType("application/json")
                .body("{\"title\":\"Integration task\",\"description\":\"API test\",\"done\":false}")
                .when().post("/api/v1/todos")
                .then().statusCode(201).body("title", equalTo("Integration task"))
                .extract().path("id");
        try {
            given().when().get("/api/v1/todos/" + id)
                    .then().statusCode(200).body("done", equalTo(false));
            given().contentType("application/json")
                    .body("{\"title\":\"Updated task\",\"description\":\"API test\",\"done\":true}")
                    .when().put("/api/v1/todos/" + id).then().statusCode(200);
            given().when().get("/api/v1/todos/" + id)
                    .then().statusCode(200)
                    .body("title", equalTo("Updated task")).body("done", equalTo(true));
        } finally {
            given().when().delete("/api/v1/todos/" + id).then().statusCode(204);
        }
        given().when().get("/api/v1/todos/" + id).then().statusCode(404);
    }
}
