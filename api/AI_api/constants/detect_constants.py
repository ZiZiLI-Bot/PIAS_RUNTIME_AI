from pydantic import BaseModel


class DetectBody(BaseModel):
    imageName: str
    typeCard: str
