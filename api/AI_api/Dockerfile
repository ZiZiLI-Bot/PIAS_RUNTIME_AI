FROM python:3.10.13-slim-bookworm

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

RUN apt update
RUN apt install -y libgl1-mesa-glx
RUN apt install -y libglib2.0-0

COPY vietocrfix.txt /usr/local/lib/python3.10/site-packages/vietocr/tool/translate.py 

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3002"]