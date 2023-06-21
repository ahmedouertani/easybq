FROM node:14 

COPY . /easybq

RUN apt-get -y update --fix-missing && \
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
WORKDIR /easybq
RUN chmod 777 ./startup.sh
CMD ["/bin/bash","startup.sh"]

FROM nginx:alpine
COPY --from=builder /*/dist/* /usr/share/nginx/html
