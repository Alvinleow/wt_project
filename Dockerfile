# Use Nginx to serve the Vue.js build
FROM nginx:alpine

# Copy the build output from Vue.js to Nginx's html directory
COPY dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
