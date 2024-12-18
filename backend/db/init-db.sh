#!/bin/bash

# Define configuration file path
CONFIG_FILE="/var/lib/postgresql/data/postgresql.conf"

grep "^[#]*[[:space:]]*logging_collector[[:space:]]*=" "$CONFIG_FILE"
GREP_EXIT_CODE=$?

# If a matching line is found (exit code is 0), replace it

if [ "$GREP_EXIT_CODE" -eq 0 ]; then
  echo "Found logging_collector setting, updating it to 'off'."
  sed -i "s/^[#]*[[:space:]]*logging_collector[[:space:]]*=.*/logging_collector = off/" "$CONFIG_FILE"
else
  # Otherwise, append the configuration at the end of the file
  echo "logging_collector setting not found, adding it."
  echo "logging_collector = off" >> "$CONFIG_FILE"
fi
set -e

# Define database and table check query
DB_CHECK_QUERY="SELECT 1 FROM pg_database WHERE datname='$POSTGRES_DB';"

# Check if the database exists
if psql -U "$POSTGRES_USER" -d postgres -tc "$DB_CHECK_QUERY" | grep -q 1; then
  echo "Database $POSTGRES_DB already exists."
else
  echo "Database $POSTGRES_DB does not exist. This should not happen since the database is supposed to be initialized automatically by the container."
fi
