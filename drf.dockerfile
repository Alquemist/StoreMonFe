FROM python:3.9.6
# The enviroment variable ensures that the python output is set straight
# to the terminal with out buffering it first
ENV PYTHONUNBUFFERED 1
RUN mkdir /StoremonAPI