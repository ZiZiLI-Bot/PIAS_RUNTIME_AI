from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers.detect_api import DetectRouter
from routers.upload_api import UploadRouter

app = FastAPI(title="SERVER RUNTIME MODEL AI", docs_url="/")

RootRouter = APIRouter()
RootRouter.include_router(UploadRouter, prefix="/upload", tags=["Upload"])
RootRouter.include_router(DetectRouter, prefix="/detect", tags=["Detect"])


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/file", StaticFiles(directory="public"), name="public")


app.include_router(RootRouter, prefix="/api/v1")
