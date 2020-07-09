#!/bin/sh
# up and running
docker-compose up -d --build

# See logs for all services
docker-compose logs -f

# See logs for only the application service
docker-compose logs -f web

# See logs for only the MongoDB service
docker-compose logs -f database

# List running containers
docker ps

# Stop all containers
docker-compose stop

# Remove all containers
docker-compose rm

# You can visit http://localhost:8080 to see the application in action.