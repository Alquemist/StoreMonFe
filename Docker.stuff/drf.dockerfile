FROM python:3.9.6
# The enviroment variable ensures that the python output is set straight
# to the terminal with out buffering it first
ENV PYTHONUNBUFFERED 1
RUN apt-get update && apt-get install git -y
RUN git clone https://github.com/Alquemist/StoreMonAPI /StoreMonAPI
WORKDIR /StoreMonAPI
RUN pip install -r requirements.txt
EXPOSE 8080
CMD python manage.py makemigrations && python manage.py migrate && python manage.py runserver