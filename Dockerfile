# Stage 1: Build the React app
FROM node:23.4.0-alpine3.20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the built app
FROM node:23.4.0-alpine3.20

# Install serve globally
RUN npm install -g serve

# Set the working directory
WORKDIR /app

# Copy the build artifacts from the previous stage
COPY --from=build /app/dist ./dist

# Expose the port the app runs on
EXPOSE 3002

# Command to serve the application
CMD ["serve", "-s", "dist", "-l", "3002"]
