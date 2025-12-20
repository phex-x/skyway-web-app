FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci || npm install

# Bundle app source
COPY . .

# Expose CRA dev server port
EXPOSE 3000

# Bind to all interfaces inside container
ENV HOST=0.0.0.0

# Start the CRA dev server
CMD ["npm", "start"]
