FROM redis:latest


ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone


COPY redis.conf /usr/local/etc/redis/redis.conf


CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
