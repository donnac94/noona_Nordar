# === BUILD STAGE ===
FROM node:20-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of your application's code
COPY . .

# Build your Remix app
RUN yarn build

# Install production node_modules only
RUN yarn install --frozen-lockfile --production

# === RUN STAGE ===
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy built artifacts from the builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["yarn", "start"]
