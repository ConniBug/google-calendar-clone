FROM node:20.3
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 40000
CMD [ "webpack", "serve" ]