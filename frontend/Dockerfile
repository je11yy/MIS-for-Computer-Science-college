FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN chown -R node:node /app
USER node

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]