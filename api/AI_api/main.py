from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.detect import plot
from utilities.response import error, success
from constants.detect import DetectBody

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/api/detect")
def detect(body: DetectBody):
    url_img = body.url_img
    if url_img is None:
        return error(None, "imgURL is required")
    else:
        name, date, ID, origin, residence, mess, imgOutUrl = plot(url_img)
        if mess == "success":
            data = {
                "name": name,
                "dateOfBirth": date,
                # "gender": gender,
                "IDCard": ID,
                "origin": origin,
                "residence": residence,
                "imgDetect": imgOutUrl,
            }
            return success(data, mess)
        else:
            return error(None, mess)
