# Multi-Agent System Flask API

This Flask API provides HTTP endpoints to interact with the multi-agent system for Celo blockchain queries and web search capabilities.

## Features

- **Multi-Agent System**: Orchestrates blockchain and search agents
- **Conversation Management**: Maintains conversation history per thread
- **RESTful API**: Clean HTTP endpoints for integration
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error responses

## API Endpoints

### Health Check
```
GET /health
```
Returns the health status of the API service.

**Response:**
```json
{
    "status": "healthy",
    "timestamp": "2025-01-01T12:00:00.000Z",
    "system_initialized": true
}
```

### System Status
```
GET /status
```
Returns system status and configuration information.

**Response:**
```json
{
    "system_initialized": true,
    "active_threads": 3,
    "timestamp": "2025-01-01T12:00:00.000Z",
    "version": "1.0.0"
}
```

### Chat with the Multi-Agent System
```
POST /chat
```
Send a message to the multi-agent system and receive a response.

**Request Body:**
```json
{
    "message": "What is the latest Celo block number?",
    "thread_id": "optional-thread-id-here"
}
```

**Response:**
```json
{
    "response": "The latest Celo block number is 12345678...",
    "thread_id": "abc123-def456-789ghi",
    "conversation": [
        {
            "role": "user",
            "content": "What is the latest Celo block number?",
            "timestamp": "2025-01-01T12:00:00.000Z"
        },
        {
            "role": "assistant", 
            "content": "The latest Celo block number is 12345678...",
            "timestamp": "2025-01-01T12:00:01.000Z"
        }
    ],
    "status": "success",
    "timestamp": "2025-01-01T12:00:01.000Z"
}
```

### Get Conversation History
```
GET /conversation/<thread_id>
```
Retrieve the full conversation history for a specific thread.

**Response:**
```json
{
    "thread_id": "abc123-def456-789ghi",
    "messages": [...],
    "message_count": 4,
    "status": "success",
    "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### Clear Conversation
```
DELETE /conversation/<thread_id>
```
Clear the conversation history for a specific thread.

### List All Conversations
```
GET /conversations
```
Get a list of all active conversation threads.

**Response:**
```json
{
    "threads": [
        {
            "thread_id": "abc123",
            "message_count": 4
        }
    ],
    "total_threads": 1,
    "status": "success",
    "timestamp": "2025-01-01T12:00:00.000Z"
}
```

## Running the API

### Using Python directly:
```bash
python app.py
```

### Using Flask CLI:
```bash
export FLASK_APP=app.py
export FLASK_ENV=development  # Optional: for debug mode
flask run
```

### Environment Variables:
- `FLASK_HOST`: Host to bind to (default: 127.0.0.1)
- `FLASK_PORT`: Port to bind to (default: 5000)
- `FLASK_DEBUG`: Enable debug mode (default: False)
- `GOOGLE_API_KEY`: Google AI API key
- `OPENAI_API_KEY`: OpenAI API key
- `TAVILY_API_KEY`: Tavily search API key
- `AI_PROVIDER`: Preferred AI provider ('google', 'openai', or 'auto')

## Example Usage

### Using curl:

1. **Health Check:**
```bash
curl http://localhost:5000/health
```

2. **Send a Chat Message:**
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the latest Celo block number?"}'
```

3. **Ask about Web Search:**
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the latest news about Celo blockchain?"}'
```

4. **Continue a Conversation:**
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Can you give me more details about that block?",
    "thread_id": "your-thread-id-here"
  }'
```

### Using Python requests:

```python
import requests
import json

# Base URL
base_url = "http://localhost:5000"

# Health check
response = requests.get(f"{base_url}/health")
print(response.json())

# Send a message
chat_data = {
    "message": "What is web3 and how does it relate to Celo?"
}
response = requests.post(f"{base_url}/chat", json=chat_data)
result = response.json()
print(f"Response: {result['response']}")
print(f"Thread ID: {result['thread_id']}")

# Continue conversation
continue_data = {
    "message": "Tell me more about Celo's consensus mechanism",
    "thread_id": result['thread_id']
}
response = requests.post(f"{base_url}/chat", json=continue_data)
print(response.json())
```

## Agent Capabilities

### Blockchain Agent
- Get latest Celo block number
- Retrieve block information
- Fetch Celo network statistics
- General blockchain queries

### Search Agent  
- Web search for current information
- News search for recent developments
- General information retrieval

### Supervisor Agent
- Orchestrates between agents
- Determines which agent to use for queries
- Manages conversation flow
- Provides comprehensive responses

## Error Responses

All error responses follow this format:
```json
{
    "error": "Error description",
    "status": "error", 
    "timestamp": "2025-01-01T12:00:00.000Z"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (missing or invalid parameters)
- `404`: Not Found (invalid endpoint or thread)
- `500`: Internal Server Error (system error)