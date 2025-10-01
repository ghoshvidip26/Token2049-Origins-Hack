"""
Flask API for the Multi-Agent System with Celo Blockchain + Web Search

This API provides endpoints to interact with the multi-agent system via HTTP requests.
"""

import os
import uuid
import logging
from typing import Dict, Any
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_core.messages import HumanMessage, AIMessage

# Local imports
from src.agents.supervisor import create_multi_agent_system, invoke_multi_agent_system
from src.utils.config import validate_config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Global variables
multi_agent_system = None
conversation_threads: Dict[str, Dict[str, Any]] = {}  # thread_id -> {"messages": [...]}


# ---------------------------
# Helpers
# ---------------------------
def initialize_system():
    """Initialize the multi-agent system."""
    global multi_agent_system

    logger.info("Initializing multi-agent system...")

    if not validate_config():
        logger.error("Configuration validation failed")
        return False

    try:
        multi_agent_system = create_multi_agent_system()
        logger.info("✅ Multi-agent system initialized successfully!")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to initialize multi-agent system: {str(e)}")
        return False


def format_message_for_api(message) -> Dict[str, Any]:
    """Format a message object for JSON response."""
    if hasattr(message, "content"):
        content = message.content
        if isinstance(message, HumanMessage):
            role = "user"
        elif isinstance(message, AIMessage):
            role = "assistant"
        else:
            role = "system"
    else:
        # Handle dict messages
        content = message.get("content", "")
        role = message.get("role", "unknown")

    return {
        "role": role,
        "content": content,
        "timestamp": datetime.now().isoformat(),
    }


# ---------------------------
# Endpoints
# ---------------------------
@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify(
        {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "system_initialized": multi_agent_system is not None,
        }
    )


@app.route("/status", methods=["GET"])
def system_status():
    """Get system status and configuration."""
    return jsonify(
        {
            "system_initialized": multi_agent_system is not None,
            "active_threads": len(conversation_threads),
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0",
        }
    )


@app.route("/chat", methods=["POST"])
def chat():
    """
    Main chat endpoint.
    Expected JSON:
    {
        "message": "Your question here",
        "thread_id": "optional-thread-id"
    }
    """
    if not multi_agent_system:
        return (
            jsonify(
                {
                    "error": "Multi-agent system not initialized",
                    "status": "error",
                }
            ),
            500,
        )

    try:
        # Parse request JSON safely
        data = request.get_json(silent=True)
        if not data:
            return (
                jsonify(
                    {"error": "Invalid JSON body", "status": "error"}
                ),
                400,
            )

        # Validate message
        user_message = str(data.get("message", "")).strip()
        if not user_message:
            return (
                jsonify(
                    {"error": "Message cannot be empty", "status": "error"}
                ),
                400,
            )

        # Optional thread ID (continue conversation)
        thread_id = data.get("thread_id", str(uuid.uuid4()))

        # Ensure thread exists
        if thread_id not in conversation_threads:
            conversation_threads[thread_id] = {"messages": []}

        # Add user message
        user_msg = HumanMessage(content=user_message)
        messages = conversation_threads[thread_id]["messages"] + [user_msg]

        logger.info(f"[{thread_id}] User: {user_message[:80]}...")

        # Run multi-agent system
        result = invoke_multi_agent_system(multi_agent_system, messages, thread_id)

        # Update conversation
        conversation_threads[thread_id] = result

        # Format messages for response
        formatted_messages = [format_message_for_api(msg) for msg in result["messages"]]

        # Latest assistant reply
        latest_response = next(
            (msg["content"] for msg in reversed(formatted_messages) if msg["role"] == "assistant"),
            "No response generated",
        )

        return jsonify(
            {
                "response": latest_response,
                "thread_id": thread_id,
                "conversation": formatted_messages,
                "status": "success",
                "timestamp": datetime.now().isoformat(),
            }
        )

    except Exception as e:
        logger.error(f"Error in /chat: {str(e)}")
        return (
            jsonify(
                {
                    "error": f"Internal server error: {str(e)}",
                    "status": "error",
                    "timestamp": datetime.now().isoformat(),
                }
            ),
            500,
        )


@app.route("/conversation/<thread_id>", methods=["GET"])
def get_conversation(thread_id):
    """Get conversation history for a given thread."""
    if thread_id not in conversation_threads:
        return jsonify({"error": "Thread not found", "status": "error"}), 404

    formatted_messages = [
        format_message_for_api(msg) for msg in conversation_threads[thread_id]["messages"]
    ]

    return jsonify(
        {
            "thread_id": thread_id,
            "messages": formatted_messages,
            "message_count": len(formatted_messages),
            "status": "success",
            "timestamp": datetime.now().isoformat(),
        }
    )


@app.route("/conversation/<thread_id>", methods=["DELETE"])
def clear_conversation(thread_id):
    """Delete a conversation thread."""
    if thread_id in conversation_threads:
        del conversation_threads[thread_id]
        return jsonify(
            {"message": f"Conversation {thread_id} cleared", "status": "success"}
        )
    else:
        return jsonify({"error": "Thread not found", "status": "error"}), 404


@app.route("/conversations", methods=["GET"])
def list_conversations():
    """List all active conversations."""
    threads = [
        {
            "thread_id": thread_id,
            "message_count": len(data.get("messages", [])),
        }
        for thread_id, data in conversation_threads.items()
    ]
    return jsonify(
        {
            "threads": threads,
            "total_threads": len(conversation_threads),
            "status": "success",
            "timestamp": datetime.now().isoformat(),
        }
    )


# ---------------------------
# Error handlers
# ---------------------------
@app.errorhandler(404)
def not_found_error(error):
    return (
        jsonify(
            {
                "error": "Endpoint not found",
                "status": "error",
                "timestamp": datetime.now().isoformat(),
            }
        ),
        404,
    )


@app.errorhandler(500)
def internal_error(error):
    return (
        jsonify(
            {
                "error": "Internal server error",
                "status": "error",
                "timestamp": datetime.now().isoformat(),
            }
        ),
        500,
    )


# ---------------------------
# Entry Point
# ---------------------------
if __name__ == "__main__":
    if initialize_system():
        logger.info("🚀 Starting Flask API server...")
        host = os.environ.get("FLASK_HOST", "127.0.0.1")
        port = int(os.environ.get("FLASK_PORT", 5000))
        debug = os.environ.get("FLASK_DEBUG", "False").lower() == "true"
        app.run(host=host, port=port, debug=debug)
    else:
        logger.error("❌ Failed to initialize system. Exiting.")
        exit(1)
