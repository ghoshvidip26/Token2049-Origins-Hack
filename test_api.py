#!/usr/bin/env python3
"""
Test script for the Multi-Agent System Flask API.

This script demonstrates how to interact with the API endpoints.
"""

import requests
import json
import time
import sys

# API Configuration
BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test the health check endpoint."""
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data}")
            return data.get('system_initialized', False)
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed. Make sure the API server is running.")
        return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_system_status():
    """Test the system status endpoint."""
    print("\n🔍 Testing system status...")
    try:
        response = requests.get(f"{BASE_URL}/status")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ System status: {data}")
            return True
        else:
            print(f"❌ System status failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ System status error: {e}")
        return False

def test_chat_blockchain():
    """Test chat with blockchain-related query."""
    print("\n🔍 Testing blockchain query...")
    try:
        chat_data = {
            "message": "What is the latest Celo block number?"
        }
        response = requests.post(f"{BASE_URL}/chat", json=chat_data)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Blockchain query successful!")
            print(f"📝 Response: {data['response']}")
            print(f"🔗 Thread ID: {data['thread_id']}")
            return data['thread_id']
        else:
            print(f"❌ Blockchain query failed: {response.status_code}")
            print(f"Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Blockchain query error: {e}")
        return None

def test_chat_search():
    """Test chat with web search query."""
    print("\n🔍 Testing web search query...")
    try:
        chat_data = {
            "message": "What are the latest news about Celo blockchain?"
        }
        response = requests.post(f"{BASE_URL}/chat", json=chat_data)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Web search query successful!")
            print(f"📝 Response: {data['response'][:200]}...")  # Truncate long response
            print(f"🔗 Thread ID: {data['thread_id']}")
            return data['thread_id']
        else:
            print(f"❌ Web search query failed: {response.status_code}")
            print(f"Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Web search query error: {e}")
        return None

def test_conversation_continuity(thread_id):
    """Test continuing a conversation in the same thread."""
    if not thread_id:
        print("\n⚠️  Skipping conversation continuity test (no thread ID)")
        return False
        
    print(f"\n🔍 Testing conversation continuity with thread {thread_id[:8]}...")
    try:
        chat_data = {
            "message": "Can you tell me more about that?",
            "thread_id": thread_id
        }
        response = requests.post(f"{BASE_URL}/chat", json=chat_data)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Conversation continuity successful!")
            print(f"📝 Response: {data['response'][:200]}...")
            print(f"💬 Total messages in conversation: {len(data['conversation'])}")
            return True
        else:
            print(f"❌ Conversation continuity failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Conversation continuity error: {e}")
        return False

def test_get_conversation(thread_id):
    """Test retrieving conversation history."""
    if not thread_id:
        print("\n⚠️  Skipping conversation history test (no thread ID)")
        return False
        
    print(f"\n🔍 Testing conversation history retrieval...")
    try:
        response = requests.get(f"{BASE_URL}/conversation/{thread_id}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Conversation history retrieved!")
            print(f"💬 Message count: {data['message_count']}")
            return True
        else:
            print(f"❌ Conversation history failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Conversation history error: {e}")
        return False

def test_list_conversations():
    """Test listing all conversations."""
    print(f"\n🔍 Testing conversation list...")
    try:
        response = requests.get(f"{BASE_URL}/conversations")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Conversation list retrieved!")
            print(f"📋 Total threads: {data['total_threads']}")
            return True
        else:
            print(f"❌ Conversation list failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Conversation list error: {e}")
        return False

def main():
    """Run all API tests."""
    print("🚀 Starting Multi-Agent System API Tests\n")
    
    # Test health check first
    if not test_health_check():
        print("\n❌ Health check failed. Make sure the API server is running with:")
        print("   python app.py")
        sys.exit(1)
    
    # Test system status
    test_system_status()
    
    # Test blockchain query
    blockchain_thread_id = test_chat_blockchain()
    
    # Test web search query  
    search_thread_id = test_chat_search()
    
    # Test conversation continuity
    if blockchain_thread_id:
        test_conversation_continuity(blockchain_thread_id)
    
    # Test conversation history retrieval
    if blockchain_thread_id:
        test_get_conversation(blockchain_thread_id)
    
    # Test conversation listing
    test_list_conversations()
    
    print("\n✨ API tests completed!")
    print("\n📚 For more examples, see the API_README.md file")

if __name__ == "__main__":
    main()