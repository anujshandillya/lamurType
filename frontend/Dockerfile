FROM node:22.16-alpine

# Set the working directory
WORKDIR /app-f

# Copy only package.json and yarn.lock to install dependencies
COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Install md5sum for file watching
RUN apk add --no-cache coreutils

# Copy and make the entrypoint script executable
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose the development port
EXPOSE 5173

# Set the entrypoint script
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Start the development server
CMD ["yarn", "vite", "--host"]