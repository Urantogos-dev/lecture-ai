from fastapi import FastAPI, UploadFile, File
import whisper
import tempfile
import os

app = FastAPI()

model = whisper.load_model("medium")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp:
        content = await file.read()
        temp.write(content)
        temp_path = temp.name

    try:
        result = model.transcribe(
            temp_path,
            language="mn"
        )

        return {
            "text": result["text"]
        }

    finally:
        os.remove(temp_path)