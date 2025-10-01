"use client";
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "../services/api";
import {
  ChatResponse,
  SystemStatus,
  HealthStatus,
  Conversation,
} from "../../lib/types";

// Health and Status hooks
export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: apiService.getHealth,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
  });
}

export function useSystemStatus() {
  return useQuery({
    queryKey: ["systemStatus"],
    queryFn: apiService.getSystemStatus,
    refetchInterval: 10000, // Refetch every 10 seconds
    retry: 2,
  });
}

// Chat hooks
export function useChat() {
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: ({
      message,
      threadId,
    }: {
      message: string;
      threadId?: string;
    }) => apiService.sendMessage(message, threadId),
    onSuccess: (data) => {
      // Invalidate conversations list to show updated message count
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      // Update conversation cache if we have the threadId
      if (data.thread_id) {
        queryClient.invalidateQueries({
          queryKey: ["conversation", data.thread_id],
        });
      }
    },
  });

  return {
    sendMessage: sendMessageMutation.mutate,
    isLoading: sendMessageMutation.isPending,
    error: sendMessageMutation.error,
    data: sendMessageMutation.data,
  };
}

export function useConversation(threadId: string | null) {
  return useQuery({
    queryKey: ["conversation", threadId],
    queryFn: () => apiService.getConversation(threadId!),
    enabled: !!threadId,
    refetchInterval: 5000, // Refetch every 5 seconds when active
  });
}

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: apiService.listConversations,
    refetchInterval: 15000, // Refetch every 15 seconds
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiService.deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

// Blockchain hooks
export function useLatestBlock() {
  return useQuery({
    queryKey: ["latestBlock"],
    queryFn: apiService.getLatestBlock,
    refetchInterval: 15000, // Refetch every 15 seconds
    retry: 2,
  });
}

export function useCeloStats() {
  return useQuery({
    queryKey: ["celoStats"],
    queryFn: apiService.getCeloStats,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
  });
}

// Custom hook for managing chat state
export function useChatState() {
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = useChat();
  const conversation = useConversation(currentThreadId);

  // Update messages when conversation data changes
  useEffect(() => {
    if (conversation.data?.messages) {
      setMessages(conversation.data.messages);
    }
  }, [conversation.data]);

  const sendMessage = useCallback(
    async (message: string) => {
      setIsTyping(true);

      // Add user message immediately for better UX
      const userMessage = {
        role: "user" as const,
        content: message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const response = await new Promise<ChatResponse>((resolve, reject) => {
          chat.sendMessage(
            { message, threadId: currentThreadId || undefined },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        });

        // Set thread ID if this is the first message
        if (!currentThreadId && response.thread_id) {
          setCurrentThreadId(response.thread_id);
        }

        // Add assistant response
        const assistantMessage = {
          role: "assistant" as const,
          content: response.response,
          timestamp: response.timestamp,
        };
        setMessages((prev) => [
          ...prev.slice(0, -1),
          userMessage,
          assistantMessage,
        ]);
      } catch (error) {
        // Remove the optimistically added user message on error
        setMessages((prev) => prev.slice(0, -1));
        throw error;
      } finally {
        setIsTyping(false);
      }
    },
    [currentThreadId, chat]
  );

  const startNewConversation = useCallback(() => {
    setCurrentThreadId(null);
    setMessages([]);
  }, []);

  return {
    messages,
    currentThreadId,
    isTyping,
    sendMessage,
    startNewConversation,
    isLoading: chat.isLoading,
    error: chat.error,
  };
}
