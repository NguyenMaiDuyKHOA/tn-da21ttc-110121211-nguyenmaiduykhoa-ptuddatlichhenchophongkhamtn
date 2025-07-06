FROM node:22.11.0

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Sử dụng nginx để serve build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 81
CMD ["nginx", "-g", "daemon off;"]