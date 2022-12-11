FROM node:14

WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build

# RUN npm run migration-generate latest

# RUN npm run migration-apply

EXPOSE 8080

CMD [ "npm", "run", "start:prod" ]