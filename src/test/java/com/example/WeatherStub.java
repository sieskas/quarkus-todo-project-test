package com.example;
import com.sun.net.httpserver.HttpServer;
import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.Map;
public class WeatherStub implements QuarkusTestResourceLifecycleManager {
    private HttpServer server;
    public Map<String,String> start() {
        try {
            server=HttpServer.create(new InetSocketAddress("127.0.0.1",0),0);
            server.createContext("/weather", exchange -> {
                String query=exchange.getRequestURI().getQuery();
                int status=query.contains("lat=2.0")?503:200;
                String body=query.contains("lat=3.0")?"{}":
                    "{\"name\":\"Montreal\",\"main\":{\"temp\":21.6},\"weather\":[{\"description\":\"clear sky\",\"icon\":\"01d\"}]}";
                byte[] bytes=body.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().add("Content-Type","application/json");
                exchange.sendResponseHeaders(status,bytes.length);
                exchange.getResponseBody().write(bytes);
                exchange.close();
            });
            server.start();
            return Map.of("weather.api-key","test-only-key","weather.base-url","http://127.0.0.1:"+server.getAddress().getPort());
        } catch(Exception e){throw new RuntimeException(e);}
    }
    public void stop(){if(server!=null)server.stop(0);}
}
