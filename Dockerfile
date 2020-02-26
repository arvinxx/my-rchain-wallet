FROM rchain/rnode:latest
RUN apt update && apt install -y netcat
COPY scripts/wait.sh /wait.sh
