"""LLM Factory module for creating appropriate language model instances."""

from langchain_google_genai import ChatGoogleGenerativeAI

from .config import (
    DEFAULT_MODEL,
    DEFAULT_TEMPERATURE,
    GOOGLE_API_KEY,
    get_available_llm,
)


def create_llm_model():
    """Create the appropriate LLM model (Google Gemini only)."""
    provider = get_available_llm()
    
    if provider == "google":
        print("Using Google Gemini model")
        return ChatGoogleGenerativeAI(
            model=DEFAULT_MODEL,
            temperature=DEFAULT_TEMPERATURE,
            google_api_key=GOOGLE_API_KEY,
        )
    else:
        raise ValueError("No valid AI provider found. Please check your Google API key.")
