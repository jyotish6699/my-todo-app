FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# "--host" is required for Vite to work in Docker
CMD ["npm", "run", "dev", "--", "--host"]