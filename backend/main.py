from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.gemini_service import generate_structured_code
from bs4 import BeautifulSoup
import logging
import json

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
        # Use structured code generator for code + suggestions
        result = generate_structured_code(request.prompt, request.language)
        code = result.get("code", "")
        suggestions = result.get("suggestions", [])
        if not code:
            logger.error("Empty structured response from Gemini API")
            content = {"code": "", "suggestions": [], "error": True, "message": "Error generating code"}
            json_str = json.dumps(content, indent=2)
            return Response(content=json_str, media_type="application/json")
        # Format HTML code for readability
        formatted_code = code
        if request.language.lower() == "html":
            formatted_code = BeautifulSoup(code, "html.parser").prettify()
        content = {"code": formatted_code, "suggestions": suggestions, "error": False, "message": ""}
        json_str = json.dumps(content, indent=2)
        return Response(content=json_str, media_type="application/json")
    except Exception as e:
        logger.error(f"Gemini API error: {str(e)}", exc_info=True)
        content = {"code": "", "suggestions": [], "error": True, "message": "Error generating code"}
        json_str = json.dumps(content, indent=2)
        return Response(content=json_str, media_type="application/json")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
