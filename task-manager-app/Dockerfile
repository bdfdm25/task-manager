FROM node:18.18-alpine3.18 as build

WORKDIR /app
COPY . . 
RUN npm install
RUN npm run build


FROM nginx:latest
COPY --from=build /app/dist/task-manager-app/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80


