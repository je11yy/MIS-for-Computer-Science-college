FROM node:20

WORKDIR /app

COPY . .

RUN npm install

COPY . .

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
