FROM node:14.17.3

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./
EXPOSE 8000
CMD ["node", "index.js"]