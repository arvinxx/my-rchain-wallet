FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf

ADD nginx.conf /etc/nginx/conf.d/

COPY dist  /usr/share/nginx/html/

EXPOSE 80
