"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatInput as ChatInputType } from "@/types/chat";
import { Wifi, WifiOff, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Chat() {
  const { isConnected, messages, error, sendMessage, clearMessages } =
    useSocket();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => `session_${crypto.randomUUID()}`);
  const [convId] = useState(() => `conv_${crypto.randomUUID()}`);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content: string, systemPrompt?: string) => {
    const message: ChatInputType = {
      session_id: sessionId,
      conv_id: convId,
      content: [{ type: "text", text: content }],
      system_prompt: systemPrompt,
      msg_type: "input",
      sender: "user",
      tools: [],
      status: "success",
      msg_id: crypto.randomUUID(),
    };

    sendMessage(message);
  };

  const connectionStatus = () => {
    if (error) {
      return (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Connection Error</span>
        </div>
      );
    }

    if (isConnected) {
      return (
        <div className="flex items-center gap-2 text-green-500">
          <Wifi className="h-4 w-4" />
          <span className="text-sm">Connected</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-yellow-500">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm">Connecting...</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Blaze Chat</h1>
            <p className="text-sm text-muted-foreground">
              AI Assistant with MCP Tools
            </p>
          </div>
          <div className="flex items-center gap-4">
            {connectionStatus()}
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              disabled={messages.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="text-lg font-medium">Welcome to Blaze</h3>
              <p className="text-muted-foreground max-w-sm">
                Start a conversation with your AI assistant. It can use various
                tools to help you with tasks.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((message) => (
              <ChatMessage key={message.msg_id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={!isConnected}
        placeholder={isConnected ? "Type your message..." : "Connecting..."}
      />
    </div>
  );
}
