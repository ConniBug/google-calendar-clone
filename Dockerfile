FROM node:20.3
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 30000
CMD [ "npm", "start" ]