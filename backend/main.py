from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.gemini_service import generate_code
import logging

app = FastAPI(title="AI Coding Agent")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    prompt: str
    language: str = "python"
    framework: str = ""

@app.post("/generate")
async def generate_code_endpoint(request: CodeRequest):
    """Endpoint for code generation"""
    logger.info(f"Generating code for: {request.prompt}")
    try:
        generated_code = generate_code(request.prompt, request.language)
        if not generated_code:
            logger.error("Empty response from Gemini API")
            return {"message": "Error generating code", "error": True}
        return {"message": generated_code, "error": False}
    except Exception as e:
        logger.error(f"Gemini API error: {str(e)}", exc_info=True)
        return {"message": "Error generating code", "error": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
