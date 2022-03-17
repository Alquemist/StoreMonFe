FROM node:14.17.3
#RUN apt-get update && apt-get install git -y
#RUN mkdir /StoreMon
RUN git clone https://github.com/Alquemist/StoreMonFe /StoreMon
RUN chmod -R 777 /StoreMon
WORKDIR /StoreMon
RUN npm install --no-package-lock
EXPOSE 3000
CMD npm start