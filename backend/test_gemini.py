import google.generativeai as genai
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Test the API key directly
API_KEY = "AIzaSyCRUxu1ByGIHryNNzgvzzJLhATE9DE8_yQ"

try:
    genai.configure(api_key=API_KEY)
    logger.info("Successfully configured Gemini API")
    
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Write a Python hello world function")
    
    if response.text:
        logger.info("Success! Generated code:")
        print(response.text)
    else:
        logger.error("Empty response from Gemini")

except Exception as e:
    logger.error(f"Gemini API test failed: {str(e)}", exc_info=True)
