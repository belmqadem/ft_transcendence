# Use the official Node.js image as the base image
FROM node:slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./


# Install dependencies
RUN npm install && apt-get update && apt-get install sqlite3 -y

# Copy the rest of the application code to the working directory
COPY . .

# Command to run the application
CMD ["npm", "run", "dev"]