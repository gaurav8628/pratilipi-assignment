FROM node:14.17.3

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./
EXPOSE 8001
CMD ["node", "index.js"]