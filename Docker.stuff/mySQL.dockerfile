FROM mysql:8.0.16
ENV MYSQL_ROOT_PASSWORD tempPass
ENV MYSQL_DATABASE storemon
ENV MYSQL_USER storemon
ENV MYSQL_PASSWORD storemon1234
EXPOSE 3306
CMD ["mysqld"]