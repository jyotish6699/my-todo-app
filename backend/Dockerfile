FROM node:18-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

EXPOSE 5000

# Use nodemon for live updates if available, otherwise node
CMD ["npm", "start"]