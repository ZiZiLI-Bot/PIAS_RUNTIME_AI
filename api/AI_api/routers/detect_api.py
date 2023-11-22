from fastapi import APIRouter
from utilities.response import error, success
from constants.detect_constants import DetectBody
from services.detect_services import detect_service

DetectRouter = APIRouter()


@DetectRouter.post("/")
async def detect(body: DetectBody):
    imgPath = "public/" + body.imageName
    typeCard = body.typeCard
    try:
        res = detect_service(imgPath, typeCard)
    except Exception as err:
        print(err)
        return error(err, "Detect failed")
    return success(res, "Detect success")
