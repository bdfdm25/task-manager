# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory in the container to /app
WORKDIR /api

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project to the working directory
COPY . .

# Build the project (if necessary)
RUN npm run build

# Start the application
CMD [ "npm", "start" ]