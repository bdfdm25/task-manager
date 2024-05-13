# Estagio 1 - Responsável por gerar o build da nossa aplicação
FROM node:18.18-alpine3.18 as build

WORKDIR /app
COPY . . 
RUN npm install
RUN npm run build | tee build-output.txt
RUN cat build-output.txt


# Stage 1: serve app with nginx server
FROM nginx:latest
COPY --from=build /app/dist/task-manager-app /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80


