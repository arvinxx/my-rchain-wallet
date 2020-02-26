#!/usr/bin/env bash

# Build wait rnode
echo ------
echo '📦' Start to Build...
docker build -t arvinx/wait-rnode --pull . -f rnode.Dockerfile
docker tag arvinx/wait-rnode arvinx/wait-rnode:0.9.22

echo '🌟' Build Successfully!
echo ------
echo '🚀' Start to push image...
docker push arvinx/wait-rnode:0.9.22
docker push arvinx/wait-rnode:latest

echo '🎉' Image uploaded successfully!

