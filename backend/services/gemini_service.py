import os
import google.generativeai as genai
from typing import Optional
import logging
from pydantic import BaseModel

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
