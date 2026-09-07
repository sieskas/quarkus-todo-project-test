FROM node:22-alpine AS web
WORKDIR /web
COPY todo-app/package*.json ./
RUN npm ci
COPY todo-app/ ./
ENV VITE_BASE_PATH=/demo-todo/ VITE_TASK_MANAGER_API_URL=/demo-todo VITE_ENV=production VITE_TASK_MANAGER_MOCK_ENABLED=false VITE_WEATHER_MOCK_ENABLED=true
RUN npm run build

FROM eclipse-temurin:17-jdk AS build
WORKDIR /source
COPY gradlew build.gradle settings.gradle gradle.properties ./
COPY gradle/ gradle/
COPY src/ src/
COPY --from=web /web/dist/ src/main/resources/META-INF/resources/
RUN chmod +x gradlew && ./gradlew quarkusBuild -Dquarkus.http.root-path=/demo-todo --no-daemon

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build --chown=10001:10001 /source/build/quarkus-app/ ./
USER 10001
ENV QUARKUS_HTTP_HOST=0.0.0.0 QUARKUS_HTTP_ROOT_PATH=/demo-todo QUARKUS_SWAGGER_UI_ALWAYS_INCLUDE=false
EXPOSE 8080
ENTRYPOINT ["java","-XX:MaxRAMPercentage=70","-jar","quarkus-run.jar"]
