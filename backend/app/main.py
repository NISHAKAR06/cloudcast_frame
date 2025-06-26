import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import List
from io import BytesIO
from PIL import Image


app = FastAPI()

# Allow CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Update if your frontend runs elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/predict")
async def predict(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...),
    file3: UploadFile = File(...)
):
    files = [file1, file2, file3]
    images = []
    for idx, file in enumerate(files, 1):
        contents = await file.read()
        filename = f"input_{idx}_{file.filename}"
        path = os.path.join(UPLOAD_DIR, filename)
        with open(path, "wb") as f:
            f.write(contents)
        print(f"Saved {filename} ({len(contents)} bytes) to {path}")
        img = Image.open(BytesIO(contents)).convert("RGB")
        images.append(img)

    # TODO: Replace this with your ML model prediction
    predicted_img = images[-1]  # Dummy: just return the last image

    buf = BytesIO()
    predicted_img.save(buf, format="PNG")
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/png")
