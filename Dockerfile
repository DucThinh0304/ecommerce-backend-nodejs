# Use a slim Node.js production image for smaller size
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker layer caching.
# This ensures npm install is only re-run if package files change.
COPY package*.json ./

# Install production dependencies only.
# npm ci is preferred in CI/CD for reproducible builds based on package-lock.json.
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Cloud Run injects the PORT environment variable.
# Your app MUST listen on this port. The default is 8080.
# We explicitly state 8080 as a common expected port, but your app should use process.env.PORT.
EXPOSE 8080

# Command to run your application.
# This should match the 'start' script in your package.json.
CMD [ "npm", "start" ]