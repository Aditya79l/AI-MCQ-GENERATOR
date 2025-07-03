from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PDFQuestionAnswering import PDFQuestionAnswering
import tempfile
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-mcqs/")
async def generate_mcqs(pdf: UploadFile = File(...), num_mcqs: int = Form(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await pdf.read())
        tmp_path = tmp.name

    try:
        qa = PDFQuestionAnswering(tmp_path)  # API key loaded from .env
        context = " ".join(qa.text_chunks)
        mcqs = qa.ask_gemini_mcqs(num_mcqs, context)
        return {"mcqs": mcqs}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    finally:
        os.remove(tmp_path)
