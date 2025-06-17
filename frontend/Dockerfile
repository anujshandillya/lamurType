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

# Expose the development port
EXPOSE 5173

# Start the development server
CMD ["yarn", "dev"]