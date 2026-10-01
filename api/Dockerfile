FROM maven:3.9-eclipse-temurin-25 AS builder
WORKDIR /workspace
COPY pom.xml ./
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:25-jre
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 1001 espp \
    && useradd --system --uid 1001 --gid espp --create-home espp \
    && mkdir -p /data/espp/attachments \
    && chown -R espp:espp /app /data/espp

COPY --from=builder --chown=espp:espp /workspace/target/*.jar /app/app.jar

ENV ESPP_API_PORT=8081 \
    ESPP_ATTACHMENTS_DIR=/data/espp/attachments \
    JAVA_OPTS=""

USER espp
EXPOSE 8081
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
