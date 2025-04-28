import os
import google.generativeai as genai
import json  # for parsing structured responses
from typing import Optional
import logging
from pydantic import BaseModel
import re 
logger = logging.getLogger(__name__)

class GeminiConfig(BaseModel):
    api_key: str
    model_name: str = "models/gemini-1.5-pro-002"  # Updated to latest stable model
    temperature: float = 0.7

# Configuration with fallback
config = GeminiConfig(
    api_key=os.getenv("GOOGLE_API_KEY") or "AIzaSyCRUxu1ByGIHryNNzgvzzJLhATE9DE8_yQ"
)

def validate_config() -> bool:
    """Validate the Gemini configuration"""
    try:
        genai.configure(api_key=config.api_key)
        
        # Verify model availability
        available_models = genai.list_models()
        if not any(m.name == config.model_name for m in available_models):
            logger.error(f"Model {config.model_name} not available. Available models: {[m.name for m in available_models]}")
            return False
            
        logger.info(f"Gemini configured successfully with model: {config.model_name}")
        return True
    except Exception as e:
        logger.error(f"Configuration validation failed: {str(e)}", exc_info=True)
        return False

# Validate on import
if not validate_config():
    raise RuntimeError("Gemini configuration validation failed")

def generate_code(prompt: str, language: str = "python") -> Optional[str]:
    """Generate code using Gemini API with robust error handling"""
    try:
        logger.info(f"Generating {language} code for: {prompt[:50]}...")
        
        model = genai.GenerativeModel(config.model_name)
        response = model.generate_content(
            f"You are an expert {language} developer. Generate clean, functional code based on: {prompt}",
            generation_config={"temperature": config.temperature},
        )
        
        if not response.text:
            logger.error("Received empty response from Gemini")
            return None
            
        logger.info("Successfully generated code")
        return response.text
        
    except Exception as e:
        logger.error(f"Code generation failed: {str(e)}", exc_info=True)
        return None

def generate_structured_code(prompt: str, language: str = "python") -> dict:
    """
    Generate code and suggestions as structured JSON via Gemini API.
    """
    model = genai.GenerativeModel(config.model_name)
    # Instruct model to output JSON
    json_prompt = (
        f"You are an expert {language} developer. Generate code for: {prompt}. "
        "Return ONLY valid JSON with keys 'code' (string) and 'suggestions' (list of strings)."
    )
    response = model.generate_content(json_prompt, generation_config={"temperature": config.temperature})
    raw = response.text or ""
    print(raw)
    raw = remove_json_code_block(raw)
    print(raw)
    try:
        data = json.loads(raw)
    except Exception:
        # Re-prompt to strictly valid JSON
        parse_prompt = (
            "The previous response was not valid JSON. "
            "Please output only valid JSON with keys 'code' and 'suggestions'. "
            f"Here is the response: {raw}"
        )
        parse_resp = model.generate_content(parse_prompt, generation_config={"temperature": 0})
        try:
            data = json.loads(parse_resp.text or "")
        except Exception:
            data = {"code": raw, "suggestions": []}
    return {"code": data.get("code", ""), "suggestions": data.get("suggestions", [])}

def remove_json_code_block(text):
    # Remove "```json" from the start and "```" from the end
    if text.startswith("```json"):
        text = text[len("```json"):].lstrip()  # Remove "```json" and any leading spaces
    if text.endswith("```"):
        text = text[:len(text)-3].rstrip()  # Remove "```" from the end

    return text