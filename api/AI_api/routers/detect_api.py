import os
from fastapi import APIRouter
from config import ABS_PATH
from utilities.response import error, success
from constants.detect_constants import DetectBody
from services.detect_services import detect_service

DetectRouter = APIRouter()


@DetectRouter.post("/")
async def detect(body: DetectBody):
    imgPath = os.path.join(ABS_PATH, f"public/{body.imageName}")
    typeCard = body.typeCard
    try:
        res = detect_service(imgPath, typeCard)
        if res["success"] == False:
            return error(res["mess"], "Detect failed")
    except Exception as err:
        print(err)
        return error(err, "Detect failed")
    return success(res, "Detect success")
