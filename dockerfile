FROM node:18

WORKDIR /app

#Install app dependencies
COPY package.json .
RUN npm install 

# Bundle app source
COPY . .

CMD ["npm","run", "dev"]