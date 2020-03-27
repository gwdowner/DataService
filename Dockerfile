FROM node:12.16.1
COPY . .
WORKDIR /www
ENV PORT=8080
EXPOSE 8080
RUN npm ci
CMD ["/bin/bash", "./container.start.sh"]