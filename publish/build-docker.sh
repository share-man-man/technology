#!/usr/bin/env bash

npx lerna run build
docker build -t technology . -f publish/Dockerfile
# docker run --name t1 -d -p 8080:8080 technology
