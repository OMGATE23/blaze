"use client";

import React from "react";
import {
  MessageContent as MessageContentType,
  ToolContent as ToolContentType,
} from "@/types/chat";
import { ToolContent } from "./ToolContent";
import { FileText, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageContentProps {
  content: MessageContentType;
}

export function MessageContent({ content }: MessageContentProps) {
  if ("tool_name" in content) {
    return <ToolContent content={content as ToolContentType} />;
  }

  // Handle TextContent
  if (content.type === "text") {
    return (
      <div className={"prose max-w-none dark:prose-invert "}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content.text || ""}
        </ReactMarkdown>
      </div>
    );
  }

  // Handle ImageContent
  if (content.type === "image_url") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ImageIcon className="h-4 w-4" />
          <span>Image</span>
        </div>
        <div className="rounded-lg overflow-hidden border">
          <Image
            src={content.image_url.url}
            alt="Uploaded image"
            className="max-w-full h-auto"
            style={{ maxHeight: "400px" }}
          />
        </div>
      </div>
    );
  }

  // Handle FileContent
  if (content.type === "file") {
    return (
      <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {content.file.filename}
          </p>
          <p className="text-xs text-muted-foreground">
            File ID: {content.file.file_id}
          </p>
        </div>
      </div>
    );
  }

  return <></>;
}
