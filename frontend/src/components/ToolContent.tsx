"use client";

import React from "react";
import { ToolContent as ToolContentType } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Wrench,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface ToolContentProps {
  content: ToolContentType;
}

export function ToolContent({ content }: ToolContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = () => {
    switch (content.tool_status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "progress":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Wrench className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (content.tool_status) {
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950";
      case "error":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950";
      case "progress":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950";
      default:
        return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950";
    }
  };

  const formatToolArgs = (args: Record<string, unknown>) => {
    return Object.entries(args).map(([key, value]) => (
      <div key={key} className="text-sm">
        <span className="font-medium text-muted-foreground">{key}:</span>{" "}
        <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
          {typeof value === "string" ? value : JSON.stringify(value)}
        </span>
      </div>
    ));
  };

  const formatToolResponse = (response: unknown) => {
    if (typeof response === "string") {
      return response;
    }
    return JSON.stringify(response, null, 2);
  };

  return (
    <div
      className={cn(
        "border rounded-lg p-3 transition-all duration-200",
        getStatusColor()
      )}
    >
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {getStatusIcon()}
        <span className="font-medium text-sm">{content.tool_name}</span>
        <Badge
          variant={
            content.tool_status === "success"
              ? "success"
              : content.tool_status === "error"
              ? "destructive"
              : content.tool_status === "progress"
              ? "info"
              : "secondary"
          }
        >
          {content.tool_status}
        </Badge>
        <div className="ml-auto">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-3 border-t pt-3">
          {Object.keys(content.tool_args).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Arguments:
              </h4>
              <div className="space-y-1">
                {formatToolArgs(content.tool_args)}
              </div>
            </div>
          )}

          {content.tool_response ? (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Response:
              </h4>
              <div className="bg-muted/50 rounded p-2 text-sm font-mono overflow-x-auto">
                <pre className="whitespace-pre-wrap">
                  {formatToolResponse(content.tool_response)}
                </pre>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}
