FROM node:16.20.2

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -f

COPY . .

# Increase Node memory for build
ENV NODE_OPTIONS=--max-old-space-size=4096

# Build React app
RUN npm run build

# Install lightweight static server
RUN npm install -g serve

EXPOSE 3026

CMD ["serve", "-s", "build", "-l", "3026"]
