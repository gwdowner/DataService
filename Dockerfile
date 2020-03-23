FROM node:12.16.1
COPY . /www
WORKDIR /www
RUN npm ci
CMD npm start