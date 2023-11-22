from pydantic import BaseModel

class DetectBody(BaseModel):
    url_img: str
