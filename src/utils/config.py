import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# LLM configurations
DEFAULT_MODEL = "gemini-2.5-flash"  # Gemini Pro preview
DEFAULT_TEMPERATURE = 0.0

# API keys
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")

# Blockchain configurations
CELO_RPC_URL = os.environ.get("CELO_RPC_URL", "https://forno.celo.org")
CELO_CHAIN_ID = 42220  # Celo Mainnet


def validate_config() -> bool:
    """Validate that all required configuration variables are set."""
    missing_vars = []

    if not GOOGLE_API_KEY:
        missing_vars.append("GOOGLE_API_KEY")

    if not TAVILY_API_KEY:
        missing_vars.append("TAVILY_API_KEY")

    if missing_vars:
        print(
            f"Error: Missing required environment variables: {', '.join(missing_vars)}"
        )
        print(
            "Please set these variables in .env file or environment before running the application."
        )
        return False

    print("Available AI provider: Google AI")
    return True


def get_available_llm():
    """Always return Google AI if API key exists, otherwise None."""
    if GOOGLE_API_KEY:
        return "google"
    return None
