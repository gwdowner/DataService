FROM node:12.16.1
COPY . .
RUN npm ci
CMD npm run batchjob:hist