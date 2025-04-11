import os
import openai
from typing import Optional

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_code(prompt: str, language: str = "python") -> Optional[str]:
    """Generate code using OpenAI API"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": f"You are an expert {language} developer. Generate clean, functional code based on the user's request."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating code: {e}")
        return None
