from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Or use specific: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file1: UploadFile = File(...), file2: UploadFile = File(...), file3: UploadFile = File(...)):
    for i, file in enumerate([file1, file2, file3], start=1):
        with open(f"input{i}.png", "wb") as f:
            f.write(await file.read())

    # Dummy prediction (gray image)
    img = Image.new("RGB", (100, 100), color=(150, 150, 150))
    img.save("predicted_frame.png")
    return FileResponse("predicted_frame.png", media_type="image/png")
