FROM rabbitmq:3-management

ENV RABBITMQ_DEFAULT_USER=guest
ENV RABBITMQ_DEFAULT_PASS=guest

VOLUME ["/var/lib/rabbitmq"]

COPY rabbitmq-init.sh /docker-entrypoint-initdb.d/rabbitmq-init.sh
RUN chmod +x /docker-entrypoint-initdb.d/rabbitmq-init.sh

EXPOSE 5672 15672

CMD ["rabbitmq-server"]
