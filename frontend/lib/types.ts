export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Conversation {
  thread_id: string;
  message_count: number;
  timestamp: string;
  messages?: Message[];
}

export interface ChatResponse {
  response: string;
  thread_id: string;
}

export interface SystemStatus {
  system_initialized?: boolean;
  status?: "operational" | "degraded" | "down";
  active_threads?: number;
  uptime?: string;
  latency?: number;
  lastUpdate?: string;
  timestamp?: string;
  version?: string;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  system_initialized: boolean;
}

// Blockchain related types
export interface BlockInfo {
  number: string;
  hash: string;
  timestamp: string;
  transactions: number;
  gasUsed: string;
  gasLimit: string;
}
