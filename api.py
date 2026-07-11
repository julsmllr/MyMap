from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from main import getNetwork
app = FastAPI()

app.mount("/web", StaticFiles(directory="web"), name="web")

@app.get("/")
def index():
    return FileResponse("./web/index.html")

@app.get("/api/network")
def returnNetwork():
    return getNetwork()