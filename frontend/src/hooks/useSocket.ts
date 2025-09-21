"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ChatInput, ChatMessage } from "@/types/chat";

export function useSocket(url: string = "http://localhost:8000/chat") {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(url, {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
      setError(null);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setError("Failed to connect to server");
    });

    // Listen for chat messages
    newSocket.on("chat", (message: ChatMessage) => {
      console.log("Received message:", message);
      setMessages((prev) => {
        const existingIndex = prev.findIndex(
          (msg) => msg.msg_id === message.msg_id
        );
        if (existingIndex >= 0) {
          // Update existing message
          const updated = [...prev];
          updated[existingIndex] = message;
          return updated;
        } else {
          // Add new message
          return [...prev, message];
        }
      });
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [url]);

  const sendMessage = (message: ChatInput) => {
    if (socket && isConnected) {
      socket.emit("chat", message);
    } else {
      setError("Not connected to server");
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    socket,
    isConnected,
    messages,
    error,
    sendMessage,
    clearMessages,
  };
}
