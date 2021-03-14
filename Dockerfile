FROM node:10.19.0

COPY package*.json /

RUN npm install

COPY . /

WORKDIR /client

COPY package*.json /

RUN npm install

RUN npm run build

COPY . .

WORKDIR /server

COPY package*.json /

RUN npm install

COPY . .

CMD ["npm", "start"]