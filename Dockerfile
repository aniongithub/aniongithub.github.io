FROM ubuntu

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update &&\
    apt-get install -y \
    git \
    git-lfs \
    wget \
    nano \
    awscli

# Download Hugo from Github, the apt-get packages are dated
RUN wget -P /tmp  https://github.com/gohugoio/hugo/releases/download/v0.62.2/hugo_0.62.2_Linux-64bit.deb &&\
    dpkg -i /tmp/hugo_0.62.2_Linux-64bit.deb