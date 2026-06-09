# Stage 1: Build the Angular app
FROM node:20 AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
# Copy the built files from Stage 1. 
# (Note: In Angular 17+, the build output is usually inside dist/frontend/browser)
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copy our custom nginx config for Angular routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
