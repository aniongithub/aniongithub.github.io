FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

RUN sudo apt-get update &&\ 
    sudo apt-get install -y \
        netcat-traditional \
        xclip