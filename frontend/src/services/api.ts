import type {
  ChatResponse,
  Conversation,
  SystemStatus,
  HealthStatus,
} from "../../lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

class ApiService {
  // Health and Status
  async getHealth(): Promise<HealthStatus> {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error("Failed to fetch health status");
    return response.json();
  }

  async getSystemStatus(): Promise<SystemStatus> {
    const response = await fetch(`${API_BASE_URL}/system/status`);
    if (!response.ok) throw new Error("Failed to fetch system status");
    return response.json();
  }

  // Chat
  async sendMessage(message: string, threadId?: string): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, thread_id: threadId }),
    });
    if (!response.ok) throw new Error("Failed to send message");
    return response.json();
  }

  async getConversation(threadId: string): Promise<Conversation> {
    const response = await fetch(`${API_BASE_URL}/conversations/${threadId}`);
    if (!response.ok) throw new Error("Failed to fetch conversation");
    return response.json();
  }

  async listConversations(): Promise<Conversation[]> {
    const response = await fetch(`${API_BASE_URL}/conversations`);
    if (!response.ok) throw new Error("Failed to fetch conversations");
    return response.json();
  }

  async deleteConversation(threadId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/conversations/${threadId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete conversation");
  }

  // Blockchain
  async getLatestBlock() {
    const response = await fetch(`${API_BASE_URL}/blockchain/latest-block`);
    if (!response.ok) throw new Error("Failed to fetch latest block");
    return response.json();
  }

  async getCeloStats() {
    const response = await fetch(`${API_BASE_URL}/blockchain/stats`);
    if (!response.ok) throw new Error("Failed to fetch Celo stats");
    return response.json();
  }
}

const apiService = new ApiService();
export default apiService;
