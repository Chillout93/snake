FROM node as build
WORKDIR /app
COPY . /app

ARG CONFIGURATION

RUN npm install 
RUN npm run-script build-$CONFIGURATION

# production environment
FROM nginx
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]