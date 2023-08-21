
FROM node:14-alpine   # Changed the Node version to 14-alpine as suggested by the error message

WORKDIR /app

COPY package*.json ./

RUN npm install       # Added this line to install dependencies using npm

COPY . .

COPY ./dist ./dist

CMD ["npm", "run", "start:dev"]
