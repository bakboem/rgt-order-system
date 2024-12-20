#!/bin/bash
sleep 5

rabbitmqadmin declare queue name=orders_queue durable=true
rabbitmqadmin declare exchange name=orders_exchange type=direct durable=true
rabbitmqadmin declare binding source=orders_exchange destination=orders_queue routing_key=orders


user_exists=$(rabbitmqctl list_users | grep -w "admin")

if [ -z "$user_exists" ]; then
    echo "User 'admin' does not exist. Creating user..."
    rabbitmqctl add_user admin admin_password
else
    echo "User 'admin' already exists. Skipping creation."
fi

echo "Setting tags and permissions for user 'admin'..."
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
echo "RabbitMQ User initialization complete!"

echo "RabbitMQ complete ALL!"
