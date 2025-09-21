"use client";

import React from "react";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { MessageContent } from "./MessageContent";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { User, Bot, Loader2, CheckCircle, XCircle } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.msg_type === "input";
  const isOutput = message.msg_type === "output";

  const getStatusIcon = () => {
    if (isUser) return null;

    switch (message.status) {
      case "progress":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    if (isUser) return "";

    switch (message.status) {
      case "progress":
        return "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50";
      case "success":
        return "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50";
      case "error":
        return "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50";
      default:
        return "";
    }
  };

  return (
    <div
      className={cn("flex gap-3 p-4", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex-1 max-w-[80%] space-y-2",
          isUser && "flex flex-col items-end"
        )}
      >
        <div
          className={cn(
            "rounded-lg p-3 space-y-2",
            isUser
              ? "bg-neutral-100 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800"
              : cn("bg-card border", getStatusColor())
          )}
        >
          {message.content.map((content, index) => (
            <MessageContent key={index} content={content} />
          ))}
        </div>

        {/* Actions */}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {message.actions.map((action, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {action}
              </Badge>
            ))}
          </div>
        )}

        {/* Tools */}
        {message.tools && message.tools.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {message.tools.map((tool, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tool}
              </Badge>
            ))}
          </div>
        )}

        {/* Status indicator */}
        {isOutput && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {getStatusIcon()}
            <span className="capitalize">{message.status}</span>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-4 w-4 text-secondary-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}
