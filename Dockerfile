FROM ubuntu:22.04
USER root


COPY . /easybq


RUN apt-get -y update && \
    apt-get -y upgrade && \
    apt-get install -y curl 
RUN curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh && \
    sh ./nodesource_setup.sh
RUN apt install nodejs 
RUN apt-get -y update && \
    npm install -g npm@latest && \
    npm install -g @angular/cli
WORKDIR /easybq
RUN rm -rf node_modules
RUN npm install
RUN ng build
COPY startup.sh /easybq
RUN npm run build
WORKDIR /easybq
RUN chmod 777 ./startup.sh
CMD ["/bin/bash","startup.sh"]


FROM nginx:alpine
COPY --from=build /easybq/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
