FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# We use npm run build to generate the production files in dist/Frontend
RUN npm run build

FROM nginx:alpine
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy Angular build output (adjust path to match Angular 17+ structure which puts files in dist/Frontend/browser)
COPY --from=build /app/dist/Frontend /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
