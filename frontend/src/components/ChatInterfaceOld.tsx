"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  TrashIcon,
  ClockIcon,
  UserIcon,
  CpuChipIcon,
  PlusIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  ArrowDownIcon,
  CubeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  useChatState,
  useConversations,
  useDeleteConversation,
  useSystemStatus,
} from "../hooks/useApi";
import type { Message } from "../../lib/types";

const ChatInterface: React.FC = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    currentThreadId,
    isTyping,
    sendMessage,
    startNewConversation,
    isLoading,
    error,
  } = useChatState();

  const { data: conversations } = useConversations();
  const deleteConversation = useDeleteConversation();
  const { data: systemStatus } = useSystemStatus();

  const isOffline =
    !systemStatus?.status || systemStatus.status !== "operational";

  // Sample conversations for demo
  const demoConversations = [
    {
      thread_id: "demo-1",
      message_count: 5,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      messages: [
        {
          role: "user" as const,
          content: "What is Celo blockchain?",
          timestamp: new Date().toISOString(),
        },
        {
          role: "assistant" as const,
          content:
            "Celo is a mobile-first blockchain platform designed to make financial tools accessible to anyone with a mobile phone...",
          timestamp: new Date().toISOString(),
        },
      ],
    },
    {
      thread_id: "demo-2",
      message_count: 3,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      messages: [
        {
          role: "user" as const,
          content: "Check CELO price",
          timestamp: new Date().toISOString(),
        },
        {
          role: "assistant" as const,
          content: "The current CELO price is approximately $0.68 USD...",
          timestamp: new Date().toISOString(),
        },
      ],
    },
  ];

  const conversationList = conversations?.threads || [];

  const filteredConversations = conversationList.filter((conv) => {
    if (!searchQuery) return true;
    const firstMessage = (conv as any).messages?.[0]?.content || "";
    return firstMessage.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const displayConversations =
    filteredConversations.length > 0 ? filteredConversations : [];

  // Demo messages when offline
  const demoMessages: Message[] = [
    {
      role: "assistant",
      content:
        "👋 Welcome to the Celo Multi-Agent Assistant! I can help you with:\n\n🔗 **Celo blockchain queries and statistics**\n🌐 **Real-time web search and news**\n🛡️ **Risk management and hedging strategies**\n\nWhat would you like to know about Celo today?",
      timestamp: new Date().toISOString(),
    },
  ];

  const displayMessages = messages?.length ? messages : demoMessages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "44px";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [inputMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage;
    setInputMessage("");

    if (isOffline) {
      // Demo response when offline
      const demoResponse = getDemoResponse(message);
      console.log("[v0] Demo mode - would send:", message);
      console.log("[v0] Demo response:", demoResponse);
      return;
    }

    try {
      await sendMessage(message);
      inputRef.current?.focus();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const getDemoResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("price") || lowerMessage.includes("celo")) {
      return "📈 Based on current market data, CELO is trading at approximately $0.68 USD with a 24h change of +2.4%. The market cap is around $342.5M.";
    }

    if (lowerMessage.includes("block") || lowerMessage.includes("latest")) {
      return (
        "🔗 Latest Celo block information:\n- Block Number: 25,847,392\n- Transactions: 142\n- Gas Used: 12.8M\n- Timestamp: " +
        new Date().toLocaleString()
      );
    }

    if (
      lowerMessage.includes("validator") ||
      lowerMessage.includes("network")
    ) {
      return "🌐 Celo Network Status:\n- Active Validators: 110\n- Network TPS: 65\n- Block Time: ~5 seconds\n- Network Utilization: 78%";
    }

    if (
      lowerMessage.includes("defi") ||
      lowerMessage.includes("yield") ||
      lowerMessage.includes("pool")
    ) {
      return "💰 DeFi opportunities on Celo:\n- Ubeswap provides AMM trading\n- Moola Market for lending\n- Symmetric for advanced portfolio management\n- Various yield farming opportunities available";
    }

    return (
      "🤖 I understand you're asking about: \"" +
      userMessage +
      '"\n\nIn demo mode, I can help with Celo blockchain queries, price information, network statistics, and DeFi opportunities. Connect to the backend for full AI-powered responses!'
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const MessageBubble: React.FC<{ message: Message; isLast?: boolean }> = ({
    message,
    isLast,
  }) => {
    const isUser = message.role === "user";

    return (
      <div
        className={`flex items-start gap-3 ${
          isUser ? "flex-row-reverse" : ""
        } mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-primary shadow-sm" : "bg-muted"
          }`}
          aria-label={isUser ? "User message" : "Assistant message"}
        >
          {isUser ? (
            <UserIcon className="w-4 h-4 text-primary-foreground" />
          ) : (
            <CpuChipIcon className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        <div className={`flex-1 max-w-3xl ${isUser ? "text-right" : ""}`}>
          <div
            className={`inline-block px-4 py-3 rounded-2xl shadow-sm ${
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-card border text-card-foreground"
            }`}
          >
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-balance">
              {message.content}
            </div>
          </div>
          <div
            className={`text-xs text-muted-foreground mt-1 ${
              isUser ? "text-right" : ""
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  const TypingIndicator = () => (
    <div
      className="flex items-start gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
      role="status"
      aria-label="Assistant is typing"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
        <CpuChipIcon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="bg-card border rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );

  const QuickActions = () => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-foreground mb-3">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={() => setInputMessage("What's the latest CELO price?")}
          className="text-left p-4 bg-card border rounded-lg hover:bg-accent hover:border-primary/50 transition-all group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-chart-1/10 rounded-lg group-hover:bg-chart-1/20 transition-colors">
              <CurrencyDollarIcon className="w-5 h-5 text-chart-1" />
            </div>
            <div>
              <div className="text-sm font-medium">Check CELO Price</div>
              <div className="text-xs text-muted-foreground">
                Get current market data
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() =>
            setInputMessage("Show me the latest block information")
          }
          className="text-left p-4 bg-card border rounded-lg hover:bg-accent hover:border-primary/50 transition-all group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-chart-2/10 rounded-lg group-hover:bg-chart-2/20 transition-colors">
              <CubeIcon className="w-5 h-5 text-chart-2" />
            </div>
            <div>
              <div className="text-sm font-medium">Latest Block</div>
              <div className="text-xs text-muted-foreground">
                View blockchain data
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() =>
            setInputMessage("What are the best DeFi opportunities on Celo?")
          }
          className="text-left p-4 bg-card border rounded-lg hover:bg-accent hover:border-primary/50 transition-all group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-chart-3/10 rounded-lg group-hover:bg-chart-3/20 transition-colors">
              <SparklesIcon className="w-5 h-5 text-chart-3" />
            </div>
            <div>
              <div className="text-sm font-medium">DeFi Opportunities</div>
              <div className="text-xs text-muted-foreground">
                Explore yield options
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setInputMessage("How is the Celo network performing?")}
          className="text-left p-4 bg-card border rounded-lg hover:bg-accent hover:border-primary/50 transition-all group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-chart-4/10 rounded-lg group-hover:bg-chart-4/20 transition-colors">
              <ChartBarIcon className="w-5 h-5 text-chart-4" />
            </div>
            <div>
              <div className="text-sm font-medium">Network Stats</div>
              <div className="text-xs text-muted-foreground">
                Check performance
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  const ErrorDisplay = () => {
    if (!error) return null;
    return (
      <div className="mx-6 mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-2">
          <ExclamationTriangleIcon className="w-5 h-5 text-destructive" />
          <div>
            <div className="text-sm font-medium text-destructive">
              Error sending message
            </div>
            <div className="text-xs text-destructive/80 mt-1">
              {error.toString()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative z-20 w-80 bg-card border-r flex flex-col transition-transform duration-300 md:translate-x-0 shadow-lg md:shadow-none`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">
              Conversations
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={startNewConversation}
                className="p-2 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
                aria-label="Start new conversation"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 md:hidden text-muted-foreground hover:bg-accent rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative mb-3">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>

          {isOffline && (
            <div className="bg-chart-4/10 border border-chart-4/20 rounded-lg p-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="w-4 h-4 text-chart-4" />
                <span className="text-sm font-medium text-chart-4">
                  Demo Mode
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Connect backend for full functionality
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {displayConversations.length > 0 ? (
            displayConversations.map((conv) => (
              <div
                key={conv.thread_id}
                className={`p-4 border-b hover:bg-accent cursor-pointer transition-colors ${
                  currentThreadId === conv.thread_id
                    ? "bg-accent/50 border-primary/20"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground line-clamp-1">
                    {(conv as any).messages?.[0]?.content?.substring(0, 30) ||
                      `Conversation ${conv.thread_id.slice(-4)}`}
                    ...
                  </span>
                  {deleteConversation && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation.mutate(conv.thread_id);
                      }}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Delete conversation"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  {(conv as any).timestamp
                    ? new Date((conv as any).timestamp).toLocaleDateString()
                    : "Recent"}
                  <span className="ml-2">({conv.message_count} messages)</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm">
                {searchQuery
                  ? "No conversations found"
                  : "No conversations yet"}
              </p>
              <p className="text-xs mt-1">
                {searchQuery
                  ? "Try a different search"
                  : "Start a new chat to get started"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <header className="bg-card border-b px-4 md:px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 md:hidden text-muted-foreground hover:bg-accent rounded-lg transition-colors"
                aria-label="Open sidebar"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">
                  Celo Multi-Agent Assistant
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  Ask questions about Celo blockchain, get real-time data, or
                  search the web
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {isOffline && (
                <span className="text-xs bg-chart-4/10 text-chart-4 px-2 py-1 rounded-full font-medium">
                  Demo
                </span>
              )}

              <div
                className={`flex items-center gap-2 text-sm ${
                  !isOffline ? "text-primary" : "text-muted-foreground"
                }`}
                role="status"
                aria-label={!isOffline ? "Connected" : "Offline"}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    !isOffline
                      ? "bg-primary animate-pulse"
                      : "bg-muted-foreground"
                  }`}
                ></div>
                <span className="hidden sm:inline">
                  {!isOffline ? "Connected" : "Offline"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <main
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 md:px-6 py-4"
        >
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 shadow-sm">
                  <CpuChipIcon className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Welcome to Celo Assistant
                </h2>
                <p className="text-muted-foreground">
                  Get real-time blockchain data, market insights, and DeFi
                  opportunities
                </p>
              </div>
              <QuickActions />
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <MessageBubble
                  key={`${message.timestamp}-${index}`}
                  message={message}
                  isLast={index === messages.length - 1}
                />
              ))}
              {isTyping && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </main>

        <ErrorDisplay />

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-4 md:right-8 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-110"
            aria-label="Scroll to bottom"
          >
            <ArrowDownIcon className="w-4 h-4" />
          </button>
        )}

        {/* Input Area */}
        <div className="bg-card border-t px-4 md:px-6 py-4 shadow-sm">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isOffline
                    ? "Try: 'What's the CELO price?' (Demo mode)"
                    : "Ask me anything about Celo blockchain..."
                }
                rows={1}
                className="w-full px-4 py-3 border bg-background rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                style={{ minHeight: "44px", maxHeight: "120px" }}
                aria-label="Message input"
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-sm"
              aria-label="Send message"
            >
              {isLoading ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <PaperAirplaneIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline">
              Press Enter to send, Shift+Enter for new line
            </span>
            <span className="sm:hidden">Enter to send</span>
            {isOffline && (
              <span className="text-chart-4 font-medium">⚡ Demo mode</span>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-10 md:hidden animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default ChatInterface;
