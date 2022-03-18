FROM python:3.9.6
# The enviroment variable ensures that the python output is set straight
# to the terminal with out buffering it first
ENV PYTHONUNBUFFERED 1
RUN apt-get update && apt-get install git -y
RUN git clone https://github.com/Alquemist/StoreMonAPI /StoreMonAPI
RUN chmod -R 777 /StoreMonAPI
WORKDIR /StoreMonAPI
#RUN /usr/local/bin/python -m pip install --upgrade pip
RUN pip install --default-timeout=1000 -r requirements.txt
EXPOSE 8000
#RUN python manage.py makemigrations app && python manage.py migrate app
CMD python manage.py runserver 0.0.0.0:8000