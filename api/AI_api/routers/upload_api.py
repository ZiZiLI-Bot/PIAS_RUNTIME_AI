import os
from fastapi import APIRouter, UploadFile, File
from utilities.response import error, success
from uuid import uuid4
from dotenv import load_dotenv

load_dotenv()

UploadRouter = APIRouter()


@UploadRouter.post("/")
async def upload(file: UploadFile = File(...)):
    imageName = file.filename.split(".")[0]
    extension = file.filename.split(".")[1]
    imageName = imageName + "_" + str(uuid4()) + "." + extension
    try:
        with open(
            os.path.join(os.path.dirname(__file__), f"../public/{imageName}"), "wb"
        ) as buffer:
            buffer.write(file.file.read())
            buffer.close()
    except Exception as err:
        print(err)
        return error(err, "Upload failed")
    finally:
        file.file.close()

    res = {"url": f"{os.getenv('HOST_NAME')}/file/{imageName}", "name": imageName}
    return success(res, "Upload success")


@UploadRouter.delete("/")
async def delete(file_name: str):
    try:
        os.remove("public/" + file_name)
    except Exception as err:
        return error(err, "Delete failed")
    return success(None, "Delete success")
