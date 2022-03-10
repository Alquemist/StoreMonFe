FROM node
RUN mkdir /StoreMon
COPY . /StoreMon
RUN chmod -R 775 /StoreMon
RUN cd /StoreMon
EXPOSE 3000
CMD npm start